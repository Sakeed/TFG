import express from "express";
import { Abogado } from "../models/abogadoModel.js";

const router = express.Router();

//Ruta para guardar un nuevo abogado
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.nombre ||
      !request.body.apellidos ||
      !request.body.dni ||
      !request.body.telefono
    ) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const newAbogado = {
      nombre: request.body.nombre,
      apellidos: request.body.apellidos,
      dni: request.body.dni,
      telefono: request.body.telefono,
      caso: request.body.caso,
      email: request.body.email,
    };

    const abogado = await Abogado.create(newAbogado);

    return response.status(201).send(abogado);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Todos los abogado
router.get("/", async (request, response) => {
  try {
    const abogado = await Abogado.find({});
    return response.status(200).json({
      count: abogado.length,
      data: abogado,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get abogado from id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const abogado = await Abogado.findById(id);
    return response.status(200).json(abogado);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//edit client
router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.nombre ||
      !request.body.apellidos ||
      !request.body.dni ||
      !request.body.telefono
    ) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const { id } = request.params;
    const result = await Abogado.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "abogado not found" });
    }
    return response.status(200).json({ message: "abogado updated" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//delete
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Abogado.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "abogado not found" });
    }
    return response
      .status(200)
      .send({ message: "abogado deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
