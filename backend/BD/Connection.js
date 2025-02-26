const mysql = require("mysql2/promise");

// Configurar la conexión con promesas
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "3812",
  database: "colinedata",
});

console.log("conexion de MySQL creado correctamente.");

module.exports = { connection };
