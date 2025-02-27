const CryptoJS = require("crypto-js");
const crypt = require("crypto");
const internal = require("stream");

const { verifyToken } = require("./LoginController");

const {
  verifyAccount,
  getRole,
  userExists,
  saveUser,
  deleteUserDB,
} = require("../BD/BD_Operations");

const {
  TuyaClient_ID,
  TuyaClient_Secret,
  TuyaUID,
  model,
  JWT_SECRET,
} = require("./Credentials");

let TuyaToken = "";
let TuyaEasy_Refresh_Token = "";
let devices_info = [];

//Ejecucion de en todo instante Para obtener informacion de tuya

exports.initialize_Tuya = async () => {
  await getToken();

  setInterval(() => {
    Refreshing_Token();
    console.log("Actualizando Acceso a la API Tuya");
  }, 7200 * 1000); // Se ejecuta cada 2 horas

  setInterval(() => {
    UpdateDeviceInfo();
    console.log("Obteniendo datos de sensores de la API Tuya");
  }, 5 * 1000); // Se ejecuta cada 5 segundos
};

const getToken = async () => {
  const urlPath = "/v1.0/token";
  const url = `https://openapi.tuyaus.com${urlPath}?grant_type=1`;

  const timestamp = Date.now().toString();
  const contentHash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const stringToSign =
    "GET" + "\n" + contentHash + "\n" + "" + "\n" + "/v1.0/token?grant_type=1";
  const signStr = TuyaClient_ID + timestamp + stringToSign;

  const headers = {
    client_id: TuyaClient_ID,
    sign: encryptStr(signStr, TuyaClient_Secret),
    t: timestamp,
    sign_method: "HMAC-SHA256",
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  TuyaToken = data.result.access_token;
  TuyaEasy_Refresh_Token = data.result.refresh_token;

  await Refreshing_Token();
};

const Refreshing_Token = async () => {
  const urlPath = "/v1.0/token/";
  const url = `https://openapi.tuyaus.com${urlPath + TuyaEasy_Refresh_Token}`;

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
    "/v1.0/token/" +
    TuyaEasy_Refresh_Token;
  const signStr = TuyaClient_ID + timestamp + stringToSign;

  const headers = {
    client_id: TuyaClient_ID,
    sign: encryptStr(signStr, TuyaClient_Secret),
    t: timestamp,
    sign_method: "HMAC-SHA256",
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  console.log("Se ha refrescado correctamente al acceso de Tuya");
  TuyaToken = data.result.access_token;
  TuyaEasy_Refresh_Token = data.result.refresh_token;
};

const UpdateDeviceInfo = async () => {
  const urlPath = `/v1.0/users/${TuyaUID}/devices`;
  const url = `https://openapi.tuyaus.com${urlPath}`;

  const timestamp = Date.now().toString();
  const contentHash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const stringToSign = "GET" + "\n" + contentHash + "\n" + "" + "\n" + urlPath;
  const signStr = TuyaClient_ID + TuyaToken + timestamp + stringToSign;

  const headers = {
    client_id: TuyaClient_ID,
    access_token: TuyaToken,
    sign: encryptStr(signStr, TuyaClient_Secret),
    t: timestamp,
    sign_method: "HMAC-SHA256",
  };

  if (TuyaToken != "" && TuyaEasy_Refresh_Token != "") {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    //console.log(data.result);

    devices_info.length = 0;
    data.result.forEach((element) => {
      if (element.model == model) {
        devices_info.push({
          tuyaID: element.id,
          online: element.online,
          result: element.status,
        });
        //console.log(element);
      }
    });
  } else {
    console.log("No se ha obtenido los datos");
  }
};

//Se obtiene datos del sensor. Obligatorio que sea el modelo de la variable model.
exports.getDeviceInfo = async (req, res, next) => {
  try {
    const { user, token } = req.headers;

    if (!token || !user) {
      return res
        .status(400)
        .json({ error: "Cuerpo no contiene uno de los datos" });
    }

    const role = await getRole(user);

    if (role != "") {
      if (!role == "admin" && !role == "metalurgico") {
        return res.status(401).json({ error: "Acceso no autorizado" });
      }
    } else {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    const verified = verifyToken(token, JWT_SECRET, user);

    if (!verified) {
      return res.status(401).json({ error: "Token invalido" });
    }

    let body = [];

    devices_info.forEach((element) => {
      console.log(element);
      body.push({
        tuyaID: element.tuyaID,
        online: element.online,
        liquid_depth: element.result[1].value,
        battery_percentage: element.result[2].value,
        max_set: element.result[3].value,
        mini_set: element.result[4].value,
        installation_height: element.result[5].value,
        liquid_depth_max: element.result[6].value,
        liquid_level_percent: element.result[7].value,
      });
    });

    res.json({ result: body });
  } catch (error) {
    console.error("No se pudo obtener informacion del dispositivo: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//firma del certificado
function encryptStr(signStr, secretKey) {
  var hash = CryptoJS.HmacSHA256(signStr, secretKey);
  var hashInBase64 = hash.toString().toUpperCase();
  return hashInBase64;
}

module.exports;
