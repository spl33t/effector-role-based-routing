import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig, loadEnv, UserConfig } from "vite";
/*import legacy from "@vitejs/plugin-legacy"
import mkcert from "vite-plugin-mkcert"*/

const appFolderName = path.resolve(process.cwd()).split("\\").slice(-1);

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  if (mode) process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig(
    {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./src"),
        },
      },
      server: {
        port: 3000,
        host: "127.0.0.1",
        proxy: {
          "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
          }
        }
      }
    }
  )
}
