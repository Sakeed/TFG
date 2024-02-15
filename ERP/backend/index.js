import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import rutasCliente from "./routes/rutasCliente.js";
import rutasAbogado from "./routes/rutasAbogado.js";
import rutasReunion from "./routes/rutasReunion.js";
import rutasAbogadoUser from "./routes/rutasAbogadoUser.js";
import rutasCaso from "./routes/rutasCaso.js";
import cors from "cors";
import multer from "multer";

const app = express();
//Middleware for parsing request body
app.use(express.json());

app.use(cors());
/*app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
*/
app.use("/client", rutasCliente);
app.use("/abogado", rutasAbogado);
app.use("/reunion", rutasReunion);
app.use("/caso", rutasCaso);
app.use("", rutasAbogadoUser);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to the database");
    app.listen(PORT, () => {
      console.log(`APP IS RUNNING ON PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
