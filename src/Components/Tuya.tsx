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

function getCredentialAccess() {
  const [access, setAccess] = useState<TokenData | null>(null);
  const getToken = async () => {
    try {
      const response = await fetch("/tuya-api/v1.0/token?grant_type=1", {
        method: "GET",
        headers: {
          client_id: "4fgcma3wh97nra5phuds",
          sign: "EF3BB4EBAAE3882E2F5A7DD46B559BF4151B1A7090E5F65598A115AECF0FCBBD",
          t: "1738979880201",
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
        setAccess(data);
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

  return <p>{access && access.result ? access.result.uid : "Cargando..."}</p>;
}

export default getCredentialAccess;
