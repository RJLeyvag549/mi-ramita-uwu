"use strict"

import cors from "cors";
import express from "express";
import morgan from "morgan";
import indexRoutes from "./src/routes/index.routes.js";
import { PORT, HOST } from "./src/config/configEnv.js";
import { connectDB } from "./src/config/configDb.js";
import { createUsers } from "./src/config/initDb.js";
import path from "path";
import { fileURLToPath } from "url";

async function setupServer() {

  const app = express();
  app.disable("x-powered-by");


  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Habilita el CORS para permitir solicitudes desde otros dominios (frontend)
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
 // Avisa a express que use JSON


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/upload', express.static(path.join(__dirname, 'src', 'upload')));

  app.use(morgan("dev"));

  app.use("/api", indexRoutes);

  

  // Enciende el servidor

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  });
}

async function setupAPI() {
  try {

    await connectDB();

    await createUsers();

    await setupServer();
  } catch (error) {
    console.error("Error en index.js -> setupAPI(): ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(): ", error));
