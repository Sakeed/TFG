import express from "express";
import { UserAbogado } from "../models/userAbogadoModel.js";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();
const { sign, decode, verify } = jsonwebtoken;

//login route

const createToken = (id) => {
  return jsonwebtoken.sign({ id }, "dadwdafwadads", { expiresIn: "3d" });
};

router.post("/login", async (request, response) => {
  try {
    if (!request.body.email || !request.body.password) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const { email, password } = request.body;

    const userAbogado = await UserAbogado.login(email, password);

    //Creamos el token
    const token = createToken(userAbogado._id);

    return response.status(200).send({ email, token });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//singUp

router.post("/signup", async (request, response) => {
  try {
    if (!request.body.email || !request.body.password) {
      return response.status(400).send({ message: "Send all fields" });
    }
    const { email, password } = request.body;

    const userAbogado = await UserAbogado.signup(email, password);

    //Creamos el token
    const token = createToken(userAbogado._id);

    return response.status(200).send({ email, token });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
