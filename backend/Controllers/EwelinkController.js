const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");

const redirectUrl = "https://example.com/callback";

const nonce = "ABCDEFGH";
const state = "10011";
let seq = "";

exports.getCode = async (req, res, next) => {
  try {
    const { client_id, client_secret } = req.headers;

    if (!client_id || !client_secret) {
      return res.status(400).json({ error: "No se entrega ningun codigo" });
    }

    seq = Date.now().toString();
    const sign = OAUTH_sign(client_id, client_secret, seq);
    const dir = `https://c2ccdn.coolkit.cc/oauth/index.html?state=${state}&clientId=${client_id}&authorization=${sign}&seq=${seq}&redirectUrl=${redirectUrl}&nonce=${nonce}&grantType=authorization_code&showQRCode=false`;

    res.json({
      url: "Ingrese la siguiente url en el navegador y autentiquese: " + dir,
    });
  } catch (error) {
    console.error("Error obteniendo token:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getToken = async (req, res, next) => {
  try {
    const { code, client_secret } = req.headers;

    if (!code) {
      return res.status(400).json({ error: "No se entrega ningun codigo" });
    }

    const urlPath = "/v2/user/oauth/token";
    const url = `https://us-apia.coolkit.cc${urlPath}`;

    const body = {
      code: code,
      redirectUrl: "https://example.com/callback",
      grantType: "authorization_code",
    };
    const sign = await encryptStr(JSON.stringify(body), client_secret);
    const headers = {
      "X-CK-Nonce": nonce,
      Authorization: `Sign ${sign}`,
      "Content-Type": "application/json",
      "X-CK-Appid": "sG8NwcKZwYwTabotAX8a0s8cYfoVnoSk",
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

    console.log("Recibiendo token de Ewelink para el clientID: ");

    res.json({
      token: data,
    });
  } catch (error) {
    console.error("Error obteniendo token:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.updateStatusofDevice = async (req, res, next) => {
  try {
    const { Authorization } = req.headers;
    const { id, state } = req.body;

    if (!Authorization && !id && !state) {
      return res.status(400).json({
        error: "No se entrega uno o más de los parámetros solicitado",
      });
    }

    if (state != "on" && state != "off") {
      return res
        .status(400)
        .json({ error: "No especifica un estado correcto. Debe ser ON o OFF" });
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
      Authorization: `Bearer ${Authorization}`,
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

    res.json({
      token: data,
    });
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
  console.log(sign);

  return sign;
}

module.exports;
