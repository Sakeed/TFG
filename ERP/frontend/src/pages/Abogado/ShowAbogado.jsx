import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const ShowAbogado = () => {
  const [abogado, setAbogado] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/abogado/${id}`)
      .then((response) => {
        setAbogado(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <div className="flex">
        <Link
          to={"/client"}
          className="bg-sky-800 text-white px-5 py-2 rounded-lg w-fit "
        >
          <BsArrowLeft className="text-2xl" />
        </Link>
      </div>
      <h1 className="text-3xl my-4">Show Abogado</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Id</span>
            <span>{abogado._id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Nombre</span>
            <span>{abogado.nombre}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Apellidos</span>
            <span>{abogado.apellidos}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">dni</span>
            <span>{abogado.dni}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">telefono</span>
            <span>{abogado.telefono}</span>
          </div>

          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">casos</span>
            <span>{abogado.caso}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAbogado;
