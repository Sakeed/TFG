import { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import BarraNavegador from "../../components/BarraNavegador";

const CreateClient = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [user_id, setUser_Id] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userAbogado } = useAuthContext();

  const handleSaveCliente = () => {
    const data = {
      nombre,
      apellidos,
      dni,
      telefono,
      user_id,
    };
    setLoading(true);
    if (userAbogado) {
      axios
        .post(
          "http://localhost:3001/client",
          data, // Aquí va el objeto de datos
          {
            headers: {
              Authorization: `Bearer ${userAbogado.token}`,
            },
          }
        )
        .then(() => {
          setLoading(false);
          navigate("/client");
        })
        .catch((error) => {
          setLoading(false);
          // alert('An error happened. Please Chack console');
          console.log(error);
        });
    } else {
      console.log("No identificado");
    }
  };

  return (
    <div className="p-4">
      <BackButton />
      <BarraNavegador />
      <h1 className="text-3xl my-4">Nuevo cliente</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Apellidos</label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">dni</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Telefono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>

        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveCliente}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateClient;
