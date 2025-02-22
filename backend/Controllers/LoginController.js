import jwt from "jsonwebtoken";
const JWT_SECRET = "z1S+o2Hj2uB9W9o5L8dDfYkX3V4tNp6yG";
import { verifyAccount } from "../BD/Connection.js";

const generateToken = (usuario) => {
  return jwt.sign(
    { user: usuario.user }, // Payload (datos a guardar en el token)
    JWT_SECRET,
    { expiresIn: "1h" } //Duracion del Token
  );
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Retorna los datos decodificados
  } catch (error) {
    return null; // Token inválido o expirado
  }
};
/*
export const login = async (req, res, next) => {
  try {
    const { user, password, token } = req.body;

    if (!user || !password) {
      return res
        .status(400)
        .json({ error: "No se entrega uno o más de los parámetros" });
    }

    if (token === "") {
      const isValid = await verifyAccount(user, password);
      if (!isValid) {
        return res.status(400).json({ error: "Credenciales inválidas" });
      }
    }

    if (token != "") {
      if (verifyToken(token) === false) {
        return res.status(400).json({ error: "Token inválido" });
      }
      if (verifyAccount(user, password) === false) {
        return res.status(400).json({ error: "Credenciales inválidas" });
      }
    }

    // Generamos el cuerpo de la respuesta
    const body = {
      access: true,
      token: token === "" ? generateToken(user) : token, // Generar nuevo token si no había
    };

    return res.json(body);
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
*/
