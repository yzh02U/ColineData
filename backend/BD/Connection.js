import mysql from "mysql2";
import crypto from "crypto";

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

// Función para verificar cuenta (usando async/await)
/*
export async function verifyAccount(user = null, client_secret = null) {
  if (!user || !client_secret) {
    console.log("Error: No se especifica uno de los parámetros");
    return false;
  }

  let verified = true;

  const query = "SELECT * FROM users";

  try {
    const [results] = await connection.promise().query(query); // Usar promesas

    for (const usuario of results) {
      console.log(
        `user: ${usuario.usuario}, pass: ${usuario.contraseña}, Rol: ${usuario.rol}`
      );
      if (
        encriptarSHA256(client_secret) === usuario.contraseña &&
        usuario.usuario === user
      ) {
        verified = true; // Se encontró coincidencia
      }
    }
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    return false;
  }

  return verified; // No se encontró coincidencia
}
*/
// Función para encriptar con SHA256
function encriptarSHA256(texto) {
  return crypto.createHash("sha256").update(texto).digest("hex").toUpperCase();
}

// Exportar conexión
export default connection;
