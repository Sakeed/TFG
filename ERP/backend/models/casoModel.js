import mongoose from "mongoose";
const { Schema } = mongoose;

const casoSchema = mongoose.Schema({
  descripcion: {
    type: String,
  },
  tipo: {
    type: String,
    required: true,
  },
  abogado_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Abogado",
  },
  facturacion: {
    type: Number,
    required: true,
  },
  casoActivo: {
    type: Boolean,
    default: true,
  },
  reunion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reunion",
    },
  ],
  comentarios: [
    {
      descripcion: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  documentos: [
    {
      nombre: {
        type: String,
        required: true,
      },
      extension: {
        type: String,
        required: true,
      },
      fecha_subida: {
        type: Date,
        required: true,
      },
      tipo: {
        type: String,
        required: true,
      },
    },
  ],
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Cliente",
  },
  user_id: {
    type: String,
    required: true,
  },
});

export const Caso = mongoose.model("Caso", casoSchema);
