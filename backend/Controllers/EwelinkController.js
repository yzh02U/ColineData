const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const crypt = require("crypto");

const nonce = "ABCDEFGH";

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

//firma del certificado
async function encryptStr(signStr, secretKey) {
  var hash = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signStr, secretKey)
  );
  return hash;
}

module.exports;
