const express = require("express");
const app = express();
const port = 5000;

const tuyaRouter = require("./Routes/Tuya_route.js");
const ewelinkRouter = require("./Routes/Ewelink_route.js");

// Middleware de logging
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Llama a la siguiente función en la cadena de middleware
};

app.use(express.json()); // Middleware para parsear JSON
// Usar middleware antes de las rutas
app.use(loggerMiddleware);

// Ruta de ejemplo para el backend
app.get("/api/mensaje", (req, res) => {
  res.json({ mensaje: "Hola desde el backend!" });
});

//Tuya Api
app.use("/api/tuya/", tuyaRouter);
app.use("/api/ewelink/", ewelinkRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
