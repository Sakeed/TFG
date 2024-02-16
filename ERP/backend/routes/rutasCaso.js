import express from "express";
import { Caso } from "../models/casoModel.js";
import requireAuth from "../middleware/requireAuth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const __dirname = path.resolve();

//Autentificacion para ver las rutas
router.use(requireAuth);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Utiliza el nombre original del archivo
  },
});

const upload = multer({ storage });

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
    const result = await Caso.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "Caso no encontrado" });
    }
    return response.status(200).send({ message: "Caso borrado correctamente" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Subir documentos
router.post("/:id/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  try {
    // Extraer la información del archivo de la solicitud
    const { originalname, mimetype } = req.file;
    const newDocumento = {
      nombre: originalname,
      extension: mimetype.split("/")[1], // Extraer la extensión del tipo MIME
      fecha_subida: new Date(),
      tipo: mimetype,
    };
    const { id } = req.params;

    // Buscar el caso por su ID y agregar el nuevo documento
    const caso = await Caso.findById(id);
    if (!caso) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }
    caso.documentos.push(newDocumento);
    await caso.save();
    res
      .status(201)
      .json({ message: "Documento subido y asignado al caso correctamente" });
  } catch (error) {
    console.error("Error al subir y asignar el documento:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al subir y asignar el documento" });
  }
});

//Descargar documentos

router.get("/:id/:documentoId/download", async (req, res) => {
  try {
    const { id, documentoId } = req.params;

    // Buscar el caso por su ID para obtener la información del documento
    const caso = await Caso.findById(id);
    if (!caso) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    // Encontrar el documento por su ID
    const documento = caso.documentos.find(
      (doc) => doc._id.toString() === documentoId
    );
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Construir la ruta del archivo del documento
    const filePath = path.join(__dirname, "./uploads", documento.nombre);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Obtener la extensión del archivo del documento
    const extension = documento.extension;

    // Configurar el encabezado Content-Type en función de la extensión del archivo
    let mimeType = "application/octet-stream";
    if (extension === ".png" || extension === "png") {
      mimeType = "image/png";
    } else if (extension === ".jpg" || extension === "jpeg") {
      mimeType = "image/jpeg";
    } else if (extension === ".docx" || "docx") {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } // Agrega más tipos MIME según sea necesario

    res.setHeader("Content-Type", mimeType);

    // Descargar el archivo
    console.log(documento.nombre);
    res.download(filePath, documento.nombre);
  } catch (error) {
    console.error("Error al descargar el documento:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al descargar el documento" });
  }
});

//Borrar documento
router.delete("/:id/:documentoId/delete", async (req, res) => {
  try {
    const { id, documentoId } = req.params;

    // Buscar el caso por su ID para obtener la información del documento
    const caso = await Caso.findById(id);
    if (!caso) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    // Encontrar el documento por su ID y eliminarlo
    const documentoIndex = caso.documentos.findIndex(
      (doc) => doc._id.toString() === documentoId
    );
    if (documentoIndex === -1) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    caso.documentos.splice(documentoIndex, 1); // Eliminar el documento del arreglo
    await caso.save();

    res.status(200).json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al eliminar el documento" });
  }
});

export default router;
