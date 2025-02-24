import mysql from "mysql2";

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost", // Servidor de MySQL
  user: "root", // Usuario de MySQL
  password: "3812", // Contraseña (ajústala)
  database: "colinedata", // Base de datos
});

// Conectar a la base de datos
export function Connect() {
  connection.connect((err) => {
    if (err) {
      console.error("Error de conexión: " + err.stack);
      return;
    }
    console.log("Conectado a MySQL con ID: " + connection.threadId);
  });
}

// Manejar cierre de la conexión cuando el proceso finaliza
function closeConnection() {
  connection.end((err) => {
    if (err) {
      console.error("Error al cerrar la conexión:", err.stack);
    } else {
      console.log("Conexión a MySQL cerrada correctamente.");
    }
    process.exit(0);
  });
}

process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);

// Exportar conexión
export default connection;
