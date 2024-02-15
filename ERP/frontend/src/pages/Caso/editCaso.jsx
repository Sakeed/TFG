import { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const EditCaso = () => {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { userAbogado } = useAuthContext();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/caso/${id}`, {
        headers: {
          Authorization: `Bearer ${userAbogado.token}`,
        },
      })
      .then((response) => {
        setDescripcion(response.data.descripcion);
        setTipo(response.data.tipo);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Un error ha ocurrido");
        console.log(error);
      });
  }, [id, userAbogado]);
  const handleEditCaso = () => {
    const data = {
      descripcion,
      tipo,
    };
    setLoading(true);
    axios
      .put(`http://localhost:3001/caso/${id}`, data, {
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
        // alert('An error happened. Please Chack console');
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Modificar caso</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Descripcion del caso
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Tipo de caso</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>

        <button className="p-2 bg-sky-300 m-8" onClick={handleEditCaso}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCaso;
