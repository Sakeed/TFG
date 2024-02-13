import express from "express";
import { Cliente } from "../models/clienteModel.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

//Ruta para crear un nuevo cliente
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
    const user_id = request.abogadoUser?._id;
    console.log("User ID:", user_id);
    const { nombre, apellidos, dni, telefono, caso } = request.body;

    const cliente = await Cliente.create({
      nombre,
      apellidos,
      dni,
      telefono,
      caso,
      user_id,
    });

    return response.status(201).send(cliente);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Todos los clientes
router.get("/", async (request, response) => {
  try {
    const cliente = await Cliente.find().sort({ createdAt: 1 });
    return response.status(200).json({
      count: cliente.length,
      data: cliente,
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
    const cliente = await Cliente.findById(id);
    return response.status(200).json(cliente);
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
    const result = await Cliente.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "Client not found" });
    }
    return response.status(200).json({ message: "Client updated" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//delete
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Cliente.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "Client not found" });
    }
    return response
      .status(200)
      .send({ message: "Client deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
