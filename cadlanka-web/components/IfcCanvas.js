'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IfcAPI } from 'web-ifc';

export default function IfcCanvas({ url }) {
  const container = useRef(null);
  const reset = useRef(() => {});
  const [status, setStatus] = useState('Loading model…');
  const [error, setError] = useState('');

  useEffect(() => {
    const host = container.current;
    const abort = new AbortController();
    const api = new IfcAPI();
    let renderer, controls, observer, frame, modelID, stopped = false, initialized = false;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#edf2f5');
    const group = new THREE.Group();
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x526075, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 10, 7);
    scene.add(light);

    const fit = () => {
      const box = new THREE.Box3().setFromObject(group);
      if (box.isEmpty()) return;
      const centre = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const radius = Math.max(size.length() / 2, 0.1);
      const angle = Math.min(THREE.MathUtils.degToRad(camera.fov / 2), Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
      const distance = radius / Math.sin(angle) * 1.2;
      camera.position.copy(centre).add(new THREE.Vector3(1, 0.7, 1).normalize().multiplyScalar(distance));
      camera.near = Math.max(radius / 10000, 0.001);
      camera.far = distance + radius * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(centre);
      controls.maxDistance = distance * 20;
      controls.update();
    };
    reset.current = fit;

    async function load() {
      let stage = 'graphics';
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.setAttribute('aria-label', 'Interactive IFC model');
        host.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        observer = new ResizeObserver(() => {
          const width = host.clientWidth;
          const height = host.clientHeight;
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        });
        observer.observe(host);
        const animate = () => {
          if (stopped) return;
          controls.update();
          renderer.render(scene, camera);
          frame = requestAnimationFrame(animate);
        };
        animate();
        stage = 'download';
        const response = await fetch(url, { signal: abort.signal });
        if (!response.ok) throw new Error('The model could not be downloaded.');
        const data = new Uint8Array(await response.arrayBuffer());
        if (stopped) return;
        setStatus('Preparing 3D geometry…');
        // Allow the status to paint before the IFC parser starts.
        await new Promise(resolve => requestAnimationFrame(resolve));
        stage = 'engine';
        api.SetWasmPath('/ifc/');
        await api.Init(undefined, true);
        initialized = true;
        if (stopped) {
          api.Dispose();
          initialized = false;
          return;
        }
        stage = 'geometry';
        modelID = api.OpenModel(data, { COORDINATE_TO_ORIGIN: true });
        const materials = new Map();
        api.StreamAllMeshes(modelID, flatMesh => {
          for (let i = 0; i < flatMesh.geometries.size(); i++) {
            const placed = flatMesh.geometries.get(i);
            const geometry = api.GetGeometry(modelID, placed.geometryExpressID);
            const vertices = api.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
            const indices = api.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
            const positions = new Float32Array(vertices.length / 2);
            const normals = new Float32Array(vertices.length / 2);
            for (let j = 0, k = 0; j < vertices.length; j += 6, k += 3) {
              positions.set(vertices.subarray(j, j + 3), k);
              normals.set(vertices.subarray(j + 3, j + 6), k);
            }
            const buffer = new THREE.BufferGeometry();
            buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            buffer.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
            buffer.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
            geometry.delete();
            const { x, y, z, w } = placed.color;
            const key = `${x},${y},${z},${w}`;
            if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color: new THREE.Color(x, y, z), opacity: w, transparent: w < 1, side: THREE.DoubleSide, roughness: 0.8 }));
            const mesh = new THREE.Mesh(buffer, materials.get(key));
            mesh.applyMatrix4(new THREE.Matrix4().fromArray(placed.flatTransformation));
            group.add(mesh);
          }
        });
        api.CloseModel(modelID);
        modelID = undefined;
        api.Dispose();
        initialized = false;
        if (!group.children.length) throw new Error('This IFC file contains no displayable geometry.');
        fit();
        setStatus('');
      } catch (err) {
        if (stopped) return;
        console.error('IFC viewer:', err);
        const messages = {
          graphics: '3D graphics (WebGL 2) could not start. Enable graphics acceleration in your browser settings, restart the browser, and try again.',
          download: 'The IFC file could not be loaded. Check your connection and reload this page.',
          engine: 'The IFC engine could not start. Reload the page. If this continues, share this message with CAD Lanka.',
          geometry: 'The IFC model could not be processed. Share this message with CAD Lanka so we can check the model.',
        };
        setError(messages[stage]);
        setStatus('');
      }
    }
    load();
    return () => {
      stopped = true;
      abort.abort();
      cancelAnimationFrame(frame);
      observer?.disconnect();
      controls?.dispose();
      if (modelID !== undefined) api.CloseModel(modelID);
      if (initialized) api.Dispose();
      const materials = new Set();
      group.traverse(object => {
        object.geometry?.dispose();
        if (object.material) materials.add(object.material);
      });
      materials.forEach(material => material.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
      reset.current = () => {};
    };
  }, [url]);

  return (
    <div>
      <div className="flex gap-sm p-sm border-b border-outline-variant">
        <button type="button" className="px-sm py-xs border border-outline-variant rounded" onClick={() => reset.current()}>Reset view</button>
        <button type="button" className="px-sm py-xs border border-outline-variant rounded" onClick={() => container.current?.requestFullscreen?.().catch(() => {})}>Full screen</button>
      </div>
      <div className="relative">
        <div ref={container} className="w-full h-[420px] sm:h-[520px] bg-slate-100" />
        {(status || error) && <p role={error ? 'alert' : 'status'} className="absolute inset-0 flex items-center justify-center p-md text-center bg-white/90">{error || status}</p>}
      </div>
    </div>
  );
}
