import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const ShowClient = () => {
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/client/${id}`)
      .then((response) => {
        setClient(response.data);
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
      <h1 className="text-3xl my-4">Show Client</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Id</span>
            <span>{client._id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Nombre</span>
            <span>{client.nombre}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Apellidos</span>
            <span>{client.apellidos}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">dni</span>
            <span>{client.dni}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">telefono</span>
            <span>{client.telefono}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Create Time</span>
            <span>{new Date(client.createdAt).toString()}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Last Update Time</span>
            <span>{new Date(client.updatedAt).toString()}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">casos</span>
            <span>{client.caso}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowClient;
