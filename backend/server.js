const express = require("express");
const app = express();
const port = 5000;

// Ruta de ejemplo para el backend
app.get("/api/mensaje", (req, res) => {
  res.json({ mensaje: "Hola desde el backend!" });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
