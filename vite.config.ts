import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // proxy: {
    //   '/med': {
    //     target: 'https://s92t9ee2c1.execute-api.ap-northeast-2.amazonaws.com',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, 'certs', 'localhost-key.pem')
      ),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'localhost.pem')),
    },
  },
});
