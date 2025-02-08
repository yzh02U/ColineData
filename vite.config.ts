import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  /*
  server: {
    host: "192.168.1.98",
    port: 5173, // Puedes cambiarlo si lo necesitas
  },
  */

  server: {
    // Servidor propxy para redirigir solicitudes a Tuya
    proxy: {
      "/tuya-api": {
        target: "https://openapi.tuyaus.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/tuya-api/, ""),
      },
    },
    // Modificar esta zona si desea correr en la ip del propio host
    host: true, // Permite acceso desde cualquier IP en tu red
    port: 5173, // Puedes cambiar el puerto si es necesario
    strictPort: true, // Evita que el puerto cambie automáticamente
  },
});
