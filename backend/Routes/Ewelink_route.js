const express = require("express");

const {} = require("../Controllers/EwelinkController.js");
const router = express.Router();

exports.getToken = async (req, res, next) => {
  try {
    const { client_id, client_secret } = req.headers;

    if (!client_id || !client_secret) {
      return res
        .status(400)
        .json({ error: "Faltan client_id o client_secret" });
    }

    const urlPath = "/v1.0/token";
    const url = `https://openapi.tuyaus.com${urlPath}?grant_type=1`;

    const timestamp = Date.now().toString();
    const contentHash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const stringToSign =
      "GET" +
      "\n" +
      contentHash +
      "\n" +
      "" +
      "\n" +
      "/v1.0/token?grant_type=1";
    const signStr = client_id + timestamp + stringToSign;

    const headers = {
      client_id: client_id,
      sign: await encryptStr(signStr, client_secret),
      t: timestamp,
      sign_method: "HMAC-SHA256",
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    console.log("Recibiendo token de TUYA para el clientID: ", client_id);

    res.json({
      token: data.result.access_token,
      easy_refresh_token: data.result.refresh_token,
    });
  } catch (error) {
    console.error("Error obteniendo token:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = router;
