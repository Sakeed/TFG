import mongoose from "mongoose";
const { Schema } = mongoose;

const abogadoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Reunion: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reunion",
    },
  ],
  Caso: [
    {
      type: Schema.Types.ObjectId,
      ref: "Caso",
    },
  ],
});

export const Abogado = mongoose.model("Abogado", abogadoSchema);
