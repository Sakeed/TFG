import express from "express";
import { Reunion } from "../models/reunionModel.js";
import mongoose from "mongoose";
import requireAuth from "../middleware/requireAuth.js";
import { Caso } from "../models/casoModel.js";

const router = express.Router();

//Autentificacion para ver las rutas
router.use(requireAuth);
//Ruta para crear una nueva reunion
router.post("/", async (req, res) => {
  try {
    const { fecha, asunto, abogadoId, clienteId, casoId } = req.body;

    // Verifica si el caso existe
    const caso = await Caso.findById(casoId);
    if (!caso) {
      return res.status(404).json({ message: "Caso not found" });
    }

    // Crea una nueva instancia de reunión
    const nuevaReunion = new Reunion({
      fecha,
      asunto,
      abogadoId,
      clienteId,
      casoId, // Asigna el ID del caso a la reunión
    });

    // Guarda la nueva reunión en la base de datos
    const reunionGuardada = await nuevaReunion.save();

    // Agrega la reunión al array de reuniones del caso
    caso.reunion.push(reunionGuardada._id);
    await caso.save();

    res.status(201).json({
      message: "Reunión added to caso successfully",
      reunion: reunionGuardada,
    });
  } catch (error) {
    console.error("Error adding reunion to caso:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Todos las reuniones
router.get("/", async (request, response) => {
  try {
    const reunion = await Reunion.find()
      .populate("abogadoId")
      .populate("clienteId");
    //response.set("Authorization", `Bearer ${userAbogado.token}`);
    return response.status(200).json({
      count: reunion.length,
      data: reunion,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get client from id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const reunion = await Reunion.findById(id);
    return response.status(200).json(reunion);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//edit client
router.put("/:id", async (request, response) => {
  try {
    if (!request.body.fecha || !request.body.asunto) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const { id } = request.params;
    const result = await Reunion.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "reunion not found" });
    }
    return response.status(200).json({ message: "reunion updated" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//delete
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Reunion.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "reunion not found" });
    }
    return response
      .status(200)
      .send({ message: "reunion deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
