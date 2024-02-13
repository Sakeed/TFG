import express from "express";
import { Caso } from "../models/casoModel.js";
import mongoose from "mongoose";
import requireAuth from "../middleware/requireAuth.js";

import { UserAbogado } from "../models/userAbogadoModel.js";

const router = express.Router();

//Autentificacion para ver las rutas
router.use(requireAuth);

//Ruta para crear un nuevo caso
router.post("/", async (request, response) => {
  try {
    if (!request.body.descripcion || !request.body.tipo) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const user_id = request.abogadoUser?._id;
    const newReunion = {
      descripcion: request.body.descripcion,
      tipo: request.body.tipo,
      abogado_id: request.body.abogado_id,
      cliente_id: request.body.cliente_id,
      casoActivo: request.body.casoActivo,
      facturacion: request.body.facturacion,
      comentarios: request.body.comentarios,
      documentos: request.body.documentos,
      reunion: request.body.reunion,
      user_id: user_id,
    };

    const caso = await Caso.create(newReunion);

    return response.status(201).send(caso);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//AÑADIR COMENTARIOS A UN CASO

router.post("/:id/comentarios", async (request, response) => {
  const { id } = request.params; // Obtiene el id del caso de los parametros
  const { descripcion } = request.body;
  try {
    // Encuentra el caso por su ID
    const caso = await Caso.findById(id);

    if (!caso) {
      return response.status(404).json({ message: "Caso no encontradoooo" });
    }

    // Agrega el comentario al arreglo de comentarios del caso
    caso.comentarios.push({ descripcion });

    // Guarda el caso actualizado en la base de datos
    await caso.save();

    response
      .status(201)
      .json({ message: "Comentario agregado correctamente", caso });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    response
      .status(500)
      .json({ message: "Error del servidor al agregar comentario" });
  }
});

//Todos los casos
router.get("/", async (request, response) => {
  try {
    const user_id = request.abogadoUser?._id;
    const caso = await Caso.find({ user_id })
      .populate("abogado_id")
      .populate("cliente_id")
      .populate("reunion");

    return response.status(200).json({
      count: caso.length,
      data: caso,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Casos antiguos get
router.get("/casosAntiguos", async (request, response) => {
  try {
    const user_id = request.abogadoUser?._id;
    const caso = await Caso.find({ user_id })
      .populate("abogado_id")
      .populate("cliente_id")
      .populate("reunion");

    return response.status(200).json({
      count: caso.length,
      data: caso,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get caso from id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const caso = await Caso.findById(id)
      .populate("abogado_id")
      .populate("cliente_id")
      .populate("reunion");
    return response.status(200).json(caso);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//edit caso
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Caso.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "caso not found" });
    }
    return response.status(200).json({ message: "caso updated" });
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

//Añadir reunion a un caso

export default router;
