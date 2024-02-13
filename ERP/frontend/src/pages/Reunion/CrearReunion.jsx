import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Importa useLocation
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";

const CrearReunion = () => {
  const [fecha, setFecha] = useState("");
  const [asunto, setAsunto] = useState("");
  const [abogadoId, setAbogadoId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [loading, setLoading] = useState(false);
  const { userAbogado } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // Utiliza useLocation para obtener la ubicación actual
  const casoId = new URLSearchParams(location.search).get("casoId");

  //Buscar el caso por la id a partir de la url, para sacar del caso el id del cliente y abogado asignados al caso
  useEffect(() => {
    const fetchCasoDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/caso/${casoId}`,
          {
            headers: {
              Authorization: `Bearer ${userAbogado.token}`,
            },
          }
        );

        const casoData = response.data;
        console.log(casoData);
        setAbogadoId(casoData.abogadoId);
        setClienteId(casoData.clienteId);
      } catch (error) {
        console.error("Error fetching caso details:", error);
      }
    };

    if (casoId) {
      fetchCasoDetails();
    }
  }, [casoId, userAbogado.token]); // Asegúrate de incluir userAbogado.token como dependencia

  const handleSaveReunion = () => {
    const data = {
      fecha,
      asunto,
      abogadoId,
      clienteId,
      casoId,
    };
    setLoading(true);
    axios
      .post("http://localhost:3001/reunion", data, {
        headers: {
          Authorization: `Bearer ${userAbogado.token}`,
        },
      })
      .then(() => {
        setLoading(false);
        navigate("/caso");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Nueva reunion</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Fecha</label>
          <input
            type="text"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Asunto</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveReunion}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CrearReunion;
