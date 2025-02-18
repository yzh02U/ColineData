const fetch = require("node-fetch");

exports.getTimeOnSwitch = async (req, res, next) => {
  const { Altura, Ancho, Largo, Velocidad, Area, Percentage } = req.headers;

  if (!Altura || !Ancho || !Largo || !Percentage || !Velocidad || !Area) {
    return res
      .status(400)
      .json({ error: "No se entrega uno de los parametros" });
  }

  try {
    //Todas las unidades en metros
    const altura = parseFloat(Altura);
    const ancho = parseFloat(Ancho);
    const largo = parseFloat(Largo);
    const percentage = parseInt(Percentage);
    const velocidad = parseFloat(Velocidad);
    const area = parseFloat(Area);
    const Q = velocidad * area;
    const Volumen_Total = altura * ancho * largo * (percentage / 100);

    const t = Volumen_Total / Q;
    res.json({
      time: t,
    });
  } catch {
    res.status(400).json({ error: "Uno de de los parametros es invalido" });
  }
};
