import React, { useState } from "react";
import "../css/Info.css";
import "../css/Base.css";
import Tuya from "./Tuya";

const Info: React.FC = () => {
  const [height, setHeight] = useState(""); // Almacena la altura del tanque
  const [width, setWidth] = useState(""); // Almacena el ancho
  const [length, setLength] = useState(""); // Almacena el largo

  return (
    <div className="container">
      {/* Contenedor principal con el tanque y los inputs */}
      <div className="content">
        {/* Tanque de agua */}
        <Tuya />

        <div className="tank-container">
          <div className="tank" style={{ height: `${height}px` }}>
            <p className="tank-text">{height ? `${height} cm` : "Vacío"}</p>
          </div>
        </div>

        {/* Formulario de entrada de dimensiones */}
        <div className="input-container">
          <h2>Ingrese dimensión teórica de la piscina</h2>
          <div>
            <label>
              Alto:
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Ancho:
              <input
                type="number"
                value={width}
                style={{ marginTop: "10px" }}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Largo:
              <input
                type="number"
                value={length}
                style={{ marginTop: "10px" }}
                onChange={(e) => setLength(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
