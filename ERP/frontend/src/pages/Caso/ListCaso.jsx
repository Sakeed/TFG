import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import BackButton from "../../components/BackButton";
import { useAuthContext } from "../../hooks/useAuthContext";
import BarraNavegador from "../../components/BarraNavegador";

const ListCaso = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userAbogado } = useAuthContext();

  useEffect(() => {
    setLoading(true);
    if (userAbogado) {
      axios
        .get("http://localhost:3001/caso", {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        })
        .then((response) => {
          const casosData = response.data.data;
          console.log(casosData);
          setCasos(casosData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.log("No identificado");
    }
  }, [userAbogado]);

  return (
    <div className="p-4 ">
      <BarraNavegador />
      <BackButton />
      <div className="flex justify-between items-center">
        <h1 className="text-4xl my-8 text-gray-800">Casos</h1>
        <Link to="/caso/create">
          <MdOutlineAddBox className="text-sky-800 text-5xl w-8 h-8 transition duration-300 ease-in-out transform hover:scale-110" />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full border-separate border-spacing-2 bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-slate-600 rounded-md">No</th>
              <th className="border border-slate-600 rounded-md">
                Descripcion
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Tipo
              </th>
              <th className="border border-slate-600 rounded-md">Abogado</th>
              <th className="border border-slate-600 rounded-md">Cliente</th>
              <th className="border border-slate-600 rounded-md">
                Facturacion
              </th>
              <th className="border border-slate-600 rounded-md">Reunion</th>
            </tr>
          </thead>
          <tbody>
            {casos
              .filter((caso) => caso.casoActivo)
              .map((caso, index) => (
                <tr key={caso._id} className="h-8">
                  <td className="border border-slate-700 rounded-md text-center">
                    {index + 1}
                  </td>
                  <td className="border border-slate-700 rounded-md text-center">
                    {caso.descripcion}
                  </td>
                  <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                    {caso.tipo}
                  </td>
                  <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                    {caso.abogado_id.nombre}
                  </td>
                  <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                    {caso.cliente_id.nombre}
                  </td>
                  <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                    {caso.facturacion}
                  </td>
                  {caso.reunion ? (
                    <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                      <div className="flex flex-col items-center">
                        {caso.reunion.map((reunion, index) => (
                          <div key={index}>{reunion.asunto}</div>
                        ))}
                      </div>
                    </td>
                  ) : (
                    <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                      -
                    </td>
                  )}
                  <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                    <div className="flex justify-center gap-x-4">
                      <Link to={`/caso/details/${caso._id}`}>
                        <BsInfoCircle className="text-2xl text-green-800 transition duration-300 ease-in-out transform hover:scale-110" />
                      </Link>
                      <Link to={`/caso/edit/${caso._id}`}>
                        <AiOutlineEdit className="text-2xl text-yellow-800 transition duration-300 ease-in-out transform hover:scale-110" />
                      </Link>
                      <Link to={`/caso/delete/${caso._id}`}>
                        <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-800 transition duration-300 ease-in-out transform hover:scale-110" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            <Link to={"/caso/casosAntiguos"}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600">
                Casos antiguos
              </button>
            </Link>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListCaso;
