const fs = require('node:fs');
const path = require('node:path');
const source = path.dirname(require.resolve('web-ifc'));
const target = path.join(__dirname, '..', 'public', 'ifc');
fs.mkdirSync(target, { recursive: true });
fs.copyFileSync(path.join(source, 'web-ifc.wasm'), path.join(target, 'web-ifc.wasm'));
