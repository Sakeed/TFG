import mongoose from "mongoose";

const clienteSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    dni: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    caso: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cliente = mongoose.model("Cliente", clienteSchema);
