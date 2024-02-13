import jsonwebtoken from "jsonwebtoken";
import { UserAbogado } from "../models/userAbogadoModel.js";

const { sign, decode, verify } = jsonwebtoken;

const requireAuth = async (request, response, next) => {
  //Verificamos la autentificacion del usuario

  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: "autorizacion requiere token" });
  }

  //Separamos del token por espacio y cogemos la segunda parte, que es el token
  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jsonwebtoken.verify(token, "dadwdafwadads");
    console.log("Decoded Token:", decodedToken); // Agrega este console.log
    const { id } = decodedToken;
    request.abogadoUser = { _id: id };
    next();
  } catch (error) {
    console.log(error);
    response.status(401).json({ error: "Petición no disponible" });
  }
};

export default requireAuth;
