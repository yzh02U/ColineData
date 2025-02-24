const jwt = require("jsonwebtoken");
const {
  verifyAccount,
  getRole,
  userExists,
  saveUser,
  deleteUserDB,
} = require("../BD/BD_Operations");
const { decode } = require("punycode");

const JWT_SECRET = "z1S+o2Hj2uB9W9o5L8dDfYkX3V4tNp6yG";

const generateToken = (usuario) => {
  return jwt.sign(
    { user: usuario }, // Payload (datos a guardar en el token)
    JWT_SECRET,
    { expiresIn: "1h" } // Duración del Token
  );
};

const verifyToken = (token, user) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user != user) {
      return false;
    }
    return decoded; // Retorna los datos decodificados
  } catch (error) {
    return null; // Token inválido o expirado
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, password, token } = req.body;

    if (!user || !password) {
      return res
        .status(400)
        .json({ error: "No se entrega uno o más de los parámetros" });
    }

    const isValid = await verifyAccount(user, password);
    if (!isValid) {
      res.status(400).json({ error: "Credenciales inválidas" });
      return;
    }

    if (token) {
      if (!verifyToken(token, user)) {
        res.status(400).json({ error: "Token inválido" });
        return;
      }
    }

    let body = "";
    if (token) {
      body = {
        access: true,
        token: token, // Generar nuevo token si no hay
        rol: await getRole(user),
      };
    } else {
      // Generamos el cuerpo de la respuesta
      body = {
        access: true,
        token: generateToken(user), // Generar nuevo token si no hay
        rol: await getRole(user),
      };
    }

    return res.json(body);
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { token, user } = req.headers;
    const { user_created, password_created, role_assigned } = req.body;

    if (
      !user ||
      !token ||
      !user_created ||
      !password_created ||
      !role_assigned
    ) {
      return res
        .status(400)
        .json({ error: "No se entrega uno o más de los parámetros" });
    }

    if (!verifyToken(token, user)) {
      res.status(400).json({ error: "Token inválido" });
      return;
    }

    const rol = await getRole(user);
    if (rol != "admin") {
      res.status(400).json({ error: "No posee los permisos necesarios" });
      return;
    }

    const existence = await userExists(user_created);

    if (existence) {
      res.status(400).json({ error: "El usuario ya existe" });
      return;
    }

    const result = await saveUser(
      user_created,
      password_created,
      role_assigned
    );

    let body = "";
    if (result) {
      body = {
        response: "usuario creado de forma exitosa",
      };
    } else {
      body = {
        err: "error al crear el esuario",
      };
    }

    return res.json(body);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { token, user } = req.headers;
    const { user_deleted } = req.body;

    if (!user || !token || !user_deleted) {
      return res
        .status(400)
        .json({ error: "No se entrega uno o más de los parámetros" });
    }

    if (!verifyToken(token, user)) {
      res.status(400).json({ error: "Token inválido" });
      return;
    }

    const rol = await getRole(user);
    if (rol != "admin") {
      res.status(400).json({ error: "No posee los permisos necesarios" });
      return;
    }

    const result = await deleteUserDB(user_deleted);

    let body = "";
    if (result) {
      body = {
        response: "usuario eliminado de forma exitosa",
      };
    } else {
      body = {
        err: "no se ha encontrado el usuario",
      };
    }

    return res.json(body);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports;
