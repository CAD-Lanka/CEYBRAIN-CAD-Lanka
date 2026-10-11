'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const IfcCanvas = dynamic(() => import('./IfcCanvas'), {
  ssr: false,
  loading: () => <p className="p-md" role="status">Starting 3D viewer…</p>,
});

export default function IfcViewer({ model, title }) {
  const [open, setOpen] = useState(false);
  return (
    <section aria-label={`3D model of ${title}`} className="border border-outline-variant rounded overflow-hidden bg-surface-container-lowest">
      <div className="p-md border-b border-outline-variant">
        <h2 className="font-headline-sm text-headline-sm text-primary">Explore the 3D Model</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Drag to rotate · Scroll or pinch to zoom · Right-drag to pan</p>
      </div>
      {open ? <IfcCanvas url={model.url} /> : (
        <div className="p-lg text-center">
          <p className="font-body-sm text-body-sm mb-md">{model.originalFilename}{model.size ? ` · ${(model.size / 1024 / 1024).toFixed(1)} MB` : ''}</p>
          <button type="button" onClick={() => setOpen(true)} className="bg-primary text-on-primary px-md py-sm rounded">Open 3D Model</button>
        </div>
      )}
    </section>
  );
}
