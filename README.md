# Geominco

El proyecto es elaborado con React, Javascript y NodeJs. Se describirá el proceso de instalación, las APIS utilizadas y requerimientos funcionales/no funcionales de este sistema.

## NodeJs

- Decargue NodeJs: https://nodejs.org/en/download

# APIS

Se adjuntan los enlaces a las APIS utilizadas:

- Ewelink: https://dev.ewelink.cc/#/
- Tuya: https://developer.tuya.com/en/docs/iot
- Eskuad: https://eskuad.notion.site/Documentaci-n-API-P-blica-1ec8a1a6f9924c8099d1af79b4f8bf66

# Instalación

- Debe instalar [MySQL Server y MySQL Wokbench](https://dev.mysql.com/downloads/mysql/) 8.0.41 para almacenar datos de sensores de corriente y creación de usuario.

![image](https://github.com/user-attachments/assets/892dd910-9ea4-4c2b-953e-b6a4d21e231a)

- Genere una nueva conexión con la base de datos en MySQL Workbench en local host. 

![image](https://github.com/user-attachments/assets/c66bc6a4-e884-499a-a7dd-58fc421cd9b3)
 
Debe crear un nuevo Schema y una tabla llamada "users" con la siguiente query:

```
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        contraseña VARCHAR(255) NOT NULL, 
        rol VARCHAR(50) NOT NULL
    );
```

## Creación de usuario:

Para añadir una capa de seguridad y proteger los datos del usuario, la contraseña se debe encriptar con un hashing SHA256 antes de almacenar en la base de datos. Puede utilizar la siguiente página para realizar una prueba:

- https://www.convertstring.com/es/Hash/SHA256

Por ejemplo, la clave "123456" produce el siguiente hashing:


```
   8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92
```

Luego se almacena en la base de datos.

![image](https://github.com/user-attachments/assets/149b6cc5-44a8-4ed1-8060-142fe56782a4)

Puede utilizar la siguiente query para guardar su credencial en la base de datos:

```
INSERT INTO users (usuario, contraseña, rol) VALUES
('usuario1', 'SHA256(contraseña_segura1)', 'admin');
```

- Clone el repositorio en su dispositivo. Observará que el proyecto "ColineData" contiene de forma separada las carpetas "backend" y "frontend". El backend será encargado de procesar las peticiones REST mientras que el frontend enviará las peticiones al backend. Debe abrir dos terminales para ejecutar las carpetas:

## Backend

- Vaya a la carpeta backend con "cd backend".
- Instale las dependencias necesarias con "npm install".
- En la ruta "ColineData/backend/BD/Connection.js" modifique los parámetros de conexión a su base de datos:

 ```
const connection = mysql.createPool({
  host: "localhost", // Servidor de MySQL
  user: "root", // Usuario de MySQL
  password: "3812", // Contraseña (ajústelo)
  database: "colinedata", // Base de datos
});
```
-En la ruta "ColineData/backend/Contollers/TuyaController.js" debe modificar las siguientes variables de acceso a la plataforma Tuya:

 ```
const TuyaClient_ID = "" ;
const TuyaClient_Secret = "";
const TuyaUID = "";
const model = "";
 ```

- Ejecute el servidor backend con "npm start".

## Frontend

- Vaya a la carpeta frontend con "cd frontend".
- Instale las dependencias necesarias con "npm install".
- Ejecute el servidor frontend con "npm start".

# Wiki

Puede acceder a la Wiki haciendo click [Home_Wiki](https://github.com/yzh02U/ColineData/wiki).
