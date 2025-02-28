const { verifyToken } = require("./LoginController");
const { JWT_SECRET, JWT_SECRET_REFRESH } = require("./Credentials");

exports.getTimeOnSwitch = async (req, res, next) => {
  /*
  Dh es la diferencia de altura en m
  DP es la diferencia de presiones. Si el liquido A2 sale al aire, DP es nulo. en pascales
  A1 es el area donde entra el liquido del tubo en m2
  A2 es el area donde sale el liquido en m2
  D es la densidad del liquido
  A3 area cubica en donde será rellenado el liquido en m3
  */
  try {
    const { Dh, DP, A1, A2, D, A3 } = req.body;
    const { user, token } = req.headers;

    if (!Dh || !DP || !A1 || !A2 || !D || !A3 || !user || !token) {
      return res
        .status(400)
        .json({ error: "No se entrega uno de los parametros" });
    }

    const verified = verifyToken(token, JWT_SECRET, user);

    if (!verified) {
      return res.status(401).json({ error: "Token invalido" });
    }

    if (parseFloat(A2) > parseFloat(A1)) {
      return res
        .status(400)
        .json({ error: "El area A2 debe ser menor que el A1" });
    }

    let h = "";
    let P = "";
    if (Dh === "Ho") {
      h = 0.0;
    } else {
      h = parseFloat(Dh);
    }

    if (DP === "Po") {
      P = 0.0;
    } else {
      P = parseFloat(DP);
    }
    //Se usa el principio de Torricelli
    const V2 = Math.sqrt(
      Math.pow(1 - parseFloat(A2) / parseFloat(A1), -1) *
        ((2 / parseFloat(D)) * P + 2 * 9.8 * h)
    );

    const t = parseFloat(A3) / (parseFloat(A2) * V2);
    res.status(200).json({
      time: t, //en segundos
    });
  } catch {
    res.status(400).json({ error: "Uno de de los parametros es invalido" });
  }
};

module.exports;
