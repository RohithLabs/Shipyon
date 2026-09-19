import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const files = ['three.min.js', 'OrbitControls.js', 'globe3d.js', 'script.js'];
      const outDir = resolve(import.meta.dirname, 'dist');
      for (const f of files) {
        const src = resolve(import.meta.dirname, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, resolve(outDir, f));
        }
      }
      const srcAssets = resolve(import.meta.dirname, 'assets');
      const dstAssets = resolve(outDir, 'assets');
      if (fs.existsSync(srcAssets)) {
        if (!fs.existsSync(dstAssets)) fs.mkdirSync(dstAssets, { recursive: true });
        for (const item of fs.readdirSync(srcAssets)) {
          const s = resolve(srcAssets, item);
          const d = resolve(dstAssets, item);
          if (fs.statSync(s).isFile() && !fs.existsSync(d)) {
            fs.copyFileSync(s, d);
          }
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [copyStaticAssets()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        contact: resolve(import.meta.dirname, 'contact.html')
      }
    }
  }
});
