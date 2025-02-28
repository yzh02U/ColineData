const { verifyToken } = require("./LoginController");
const { JWT_SECRET, JWT_SECRET_REFRESH } = require("./Credentials");

exports.getTimeOnSwitch = async (req, res, next) => {
  /*

  H1 es la altura máxima del tanque
  H2 es la altura donde se encuentra el area A2 
  A1 es el area donde entra el liquido del tubo en m2
  A2 es el area donde sale el liquido en m2
  A3 Volumen en donde será rellenado el liquido en m3
  */
  try {
    const { H1, H2, A2, A1, V } = req.body;
    const { user, token } = req.headers;

    if (!H1 || !H2 || !A1 || !A2 || !user || !token || !V) {
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

    if (parseFloat(H2) > parseFloat(H1)) {
      return res
        .status(400)
        .json({ error: "La altura H1 debe ser mayor o igual que H2" });
    }

    if (
      parseFloat(H2) == 0 ||
      parseFloat(H1) == 0 ||
      parseFloat(A1) == 0 ||
      parseFloat(A2) == 0
    ) {
      return res.status(400).json({ error: "No pueden existir valores nulos" });
    }

    //Se usa el principio de Torricelli para calcular el tiempo maximo en vaciarse el tanque
    const t1 =
      Math.sqrt(2 / 9.8) *
      (parseFloat(A1) / parseFloat(A2)) *
      (Math.sqrt(H1) - Math.sqrt(H2));

    const VTotal = parseFloat(A1) * (parseFloat(H1) - parseFloat(H2));

    if (VTotal < parseFloat(V)) {
      return res.status(400).json({
        error:
          "El tanque de suministro de agua debe tener un volumen mayor o igual que la piscina/tanques SX",
      });
    }

    //Ahora se calcula el tiempo que rellenaria una piscina

    const t2 = (parseFloat(V) * t1) / VTotal;

    res.status(200).json({
      time: t2, //en segundos
    });
  } catch {
    res.status(400).json({ error: "Uno de de los parametros es invalido" });
  }
};

module.exports;
