import mongoose from "mongoose";
const { Schema } = mongoose;

var reunionSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  asunto: {
    type: String,
    required: true,
  },
  abogadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Abogado",
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
  },
  casoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Caso",
  },
});

export const Reunion = mongoose.model("Reunion", reunionSchema);
