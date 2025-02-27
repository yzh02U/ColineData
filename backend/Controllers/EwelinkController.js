const CryptoJS = require("crypto-js");
const crypto = require("crypto");

const {
  verifyAccount,
  getRole,
  userExists,
  saveUser,
  deleteUserDB,
} = require("../BD/BD_Operations");

const { verifyToken } = require("./LoginController");

const {
  EwelinkAPP_ID,
  EwelinkAPP_Secret,
  JWT_SECRET,
  redirectUrl,
} = require("./Credentials");

const nonce = "ABCDEFGH";
const state = "10011";
let seq = "";
let Ewelinkcode = "";
let EwelinkAccessToken = "";
let EwelinkRefreshToken = "";

exports.initialize_Ewelink = async () => {
  seq = Date.now().toString();
  const sign = OAUTH_sign(EwelinkAPP_ID, EwelinkAPP_Secret, seq);
  const dir = `https://c2ccdn.coolkit.cc/oauth/index.html?state=${state}&clientId=${EwelinkAPP_ID}&authorization=${sign}&seq=${seq}&redirectUrl=${redirectUrl}&nonce=${nonce}&grantType=authorization_code&showQRCode=false`;
  console.log(
    "Autentiquese en esta url para comenzar a utilizar los servicios de Ewelink: " +
      dir
  );

  setInterval(() => {
    refreshToken();
    console.log("Actualizando Acceso a la API Tuya");
  }, 1728000 * 1000); // Se ejecuta cada 20 horas
};

const getToken = async () => {
  try {
    const urlPath = "/v2/user/oauth/token";
    const url = `https://us-apia.coolkit.cc${urlPath}`;

    const body = {
      code: Ewelinkcode,
      redirectUrl: redirectUrl,
      grantType: "authorization_code",
    };
    const sign = await encryptStr(JSON.stringify(body), EwelinkAPP_Secret);
    const headers = {
      "X-CK-Nonce": nonce,
      Authorization: `Sign ${sign}`,
      "Content-Type": "application/json",
      "X-CK-Appid": EwelinkAPP_ID,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Se recibe un token de Ewelink: ");
    console.log(data);
    EwelinkAccessToken = data.data.accessToken;
    EwelinkRefreshToken = data.data.refreshToken;
  } catch (error) {
    console.error(
      "Ha surgido un problema al autenticarse por Ewelink: ",
      error
    );
  }
};

const refreshToken = async () => {
  try {
    const urlPath = "/v2/user/refresh";
    const url = `https://us-apia.coolkit.cc${urlPath}`;

    const body = {
      rt: EwelinkRefreshToken,
    };
    const sign = await encryptStr(JSON.stringify(body), EwelinkAPP_Secret);
    const headers = {
      "X-CK-Nonce": nonce,
      Authorization: `Sign ${sign}`,
      "Content-Type": "application/json",
      "X-CK-Appid": EwelinkAPP_ID,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("refrescando token de Ewelink: ");
    console.log(data);
    EwelinkAccessToken = data.data.at;
    EwelinkRefreshToken = data.data.rt;
  } catch (error) {
    console.error(
      "Ha surgido un problema al autenticarse por Ewelink: ",
      error
    );
  }
};

exports.getCode = async (req, res, next) => {
  try {
    const { code, region } = req.query;

    if (!code || !region) {
      console.log(
        "No se ha podido validar el acceso a ewelink. No se ha recibido ningun codigo de intercambio."
      );
      return;
    }
    Ewelinkcode = code;
    console.log("Se ha recibido un codigo de ewelink: " + code);
    await getToken();
  } catch (error) {
    console.error(
      "Ha surgido un problema al autenticarse por Ewelink: ",
      error
    );
  }
};

exports.updateStatusofDevice = async (req, res, next) => {
  try {
    const { user, token } = req.headers;
    const { id, state } = req.body;

    if (!user && !token && !id && !state) {
      return res.status(400).json({
        error: "No se entrega uno o más de los parámetros solicitado",
      });
    }

    if (state != "on" && state != "off") {
      return res
        .status(400)
        .json({ error: "No especifica un estado correcto. Debe ser on o off" });
    }

    const verified = verifyToken(token, JWT_SECRET, user);
    if (!verified) {
      return res.status(401).json({ error: "Token invalido" });
    }

    if (state != "on" && state != "off") {
      return res
        .status(400)
        .json({ error: "No especifica un estado correcto. Debe ser on o off" });
    }

    const urlPath = "/v2/device/thing/status";
    const url = `https://us-apia.coolkit.cc${urlPath}`;

    const body = {
      type: 1,
      id: id,
      params: {
        switch: state,
      },
    };

    const headers = {
      "X-CK-Nonce": nonce,
      Authorization: `Bearer ${EwelinkAccessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    if (res.error != 0) {
      res.status(503).json({
        error: "dispositivo fuera de conexion o id incorrecta",
      });
    } else {
      res.status(200).json({
        response: "se ha modificado el estado del dispositivo corrrectamente",
      });
    }
  } catch (error) {
    console.error("Error obteniendo token:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//firma del certificado
async function encryptStr(signStr, secretKey) {
  var hash = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signStr, secretKey)
  );
  return hash;
}

//Encriptacion para la obtencion del codigo
function OAUTH_sign(clientId, clientSecret, seq) {
  const buffer = Buffer.from(`${clientId}_${seq}`, "utf-8");
  const sign = crypto
    .createHmac("sha256", clientSecret)
    .update(buffer)
    .digest("base64");

  return sign;
}

module.exports;
