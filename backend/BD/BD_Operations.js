const mysql = require("mysql2");
const crypto = require("crypto");
const { connection } = require("./Connection");

// Función para verificar cuenta (usando async/await)
async function verifyAccount(user = null, client_secret = null) {
  if (!user || !client_secret) {
    console.log("Error: No se especifica uno de los parámetros");
    return false;
  }

  let verified = false;
  const query = "SELECT * FROM users";

  try {
    const [results] = await connection.query(query); // Usar promesas

    for (const usuario of results) {
      console.log(
        `user: ${usuario.usuario}, pass: ${usuario.contraseña}, Rol: ${usuario.rol}`
      );
      if (client_secret === usuario.contraseña && usuario.usuario === user) {
        verified = true; // Se encontró coincidencia
      }
    }
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    return false;
  }

  return verified;
}

async function getRole(user = null) {
  if (!user) {
    console.log("Error: No se especifica uno de los parámetros");
    return "";
  }

  const query = `SELECT * FROM users WHERE usuario = "${user}"`;
  let rol = "";

  try {
    const [results] = await connection.query(query); // Usar promesas
    rol = results[0].rol;
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    return "";
  }

  return rol;
}

async function userExists(user = null) {
  if (!user) {
    console.error("Error: No se especifica uno de los parámetros");
    return false;
  }

  // Consulta para buscar el usuario en la base de datos
  const query = `SELECT * FROM users WHERE usuario = "${user}"`;

  try {
    const [results] = await connection.query(query); // Usar promesas
    return results.length > 0;
  } catch (err) {
    console.error("Error al verificar la existencia del usuario:", err);
    return false;
  }
}

async function saveUser(user, password, role) {
  // Verificar que se hayan recibido todos los parámetros requeridos
  if (!user || !password || !role) {
    console.error(
      "Error: Se requieren los parámetros usuario, contrasena y rol"
    );
    return false;
  }

  // Consulta parametrizada para insertar un nuevo usuario en la tabla "users"
  const query =
    "INSERT INTO users ( usuario, contraseña, rol) VALUES ( ?, ?, ?)";
  const pass = encriptarSHA256(password);

  try {
    const [result] = await connection.query(query, [user, pass, role]);
    // Si se inserta al menos una fila, se retorna true
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error al guardar el usuario:", err);
    return false;
  }
}

async function deleteUserDB(user) {
  // Verificar que se haya recibido el parámetro requerido
  if (!user) {
    console.error("Error: Se requiere el parámetro usuario");
    return false;
  }

  // Consulta parametrizada para eliminar el usuario de la tabla "users"
  const query = "DELETE FROM users WHERE usuario = ?";

  try {
    const [result] = await connection.query(query, [user]);
    // Si se elimina al menos una fila, se retorna true
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    return false;
  }
}

function encriptarSHA256(texto) {
  return crypto.createHash("sha256").update(texto).digest("hex").toUpperCase();
}

module.exports = {
  verifyAccount,
  getRole,
  userExists,
  saveUser,
  deleteUserDB,
};
