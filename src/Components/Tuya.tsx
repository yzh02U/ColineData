import { useEffect, useState } from "react";

interface TokenData {
  result: {
    access_token: string;
    expire_time: number;
    refresh_token: string;
    uid: string;
  };
  success: boolean;
  t: number;
  tid: string;
}

function getToken() {
  const [level, setLevel] = useState<TokenData | null>(null);
  const p = "";
  const getToken = async () => {
    try {
      const response = await fetch("/tuya-api/v1.0/token?grant_type=1", {
        method: "GET",
        headers: {
          client_id: "4fgcma3wh97nra5phuds",
          sign: "D399C902EFB07A644D7795EDE51B3121B698B90012FBBE725F0B6140C7DFC17A",
          t: "1738977996030",
          sign_method: "HMAC-SHA256",
          nonce: "",
          stringToSign: "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: TokenData = await response.json();

      // Verificar que 'result' existe antes de actualizar el estado
      if (data && data.result) {
        setLevel(data);
      } else {
        console.error("Respuesta inesperada de la API:", data);
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return <p>{level && level.result ? level.result.uid : "Cargando..."}</p>;
}

export default getToken;
