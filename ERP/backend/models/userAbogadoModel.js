import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";
import validator from "validator";

const userAbogadoSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//signup metodo
userAbogadoSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("Rellena todos los huecos");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email no valido");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("La contrasena no es fuerte ");
  }
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("El email ya esta en  uso");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const userAbogado = await this.create({ email, password: hash });

  return userAbogado;
};

//login static method

userAbogadoSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Rellena todos los huecos");
  }

  const userAbogado = await this.findOne({ email });

  if (!userAbogado) {
    throw Error("El email no es correcto");
  }

  const match = await bcrypt.compare(password, userAbogado.password);
  if (!match) {
    throw Error("Contrasena incorrecta");
  }
  return userAbogado;
};

export const UserAbogado = mongoose.model("UserAbogado", userAbogadoSchema);
