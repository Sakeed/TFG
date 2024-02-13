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

const ListAbogado = () => {
  const [abogados, setAbogados] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userAbogado } = useAuthContext();
  useEffect(() => {
    setLoading(true);
    if (userAbogado) {
      axios
        .get("http://localhost:3001/abogado", {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        })
        .then((response) => {
          console.log(response.data);

          setAbogados(response.data.data);
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
    <div className="p-4">
      <BarraNavegador />
      <BackButton />
      <div className="flex justify-between items-center">
        <h1 className="text-4x1 my-8">Lista de abogados</h1>
        <Link to="/client/create">
          <MdOutlineAddBox className="text-sky-800 text-5x2 w-8 h-8" />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="border border-slate-600 rounded-md">No</th>
              <th className="border border-slate-600 rounded-md">Nombre</th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Apellidos
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                dni
              </th>
              <th className="border border-slate-600 rounded-md ">Telefono</th>
            </tr>
          </thead>
          <tbody>
            {abogados.map((abogado, index) => (
              <tr key={abogado._id} className="h-8">
                <td className="border border-slate-700 rounded-md text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {abogado.nombre}
                </td>
                <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                  {abogado.apellidos}
                </td>
                <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                  {abogado.dni}
                </td>
                <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                  {abogado.telefono}
                </td>
                <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                  {abogado.email}
                </td>
                <td className="border border-slate-700 rounded-md text-center mx-md:hidden">
                  <div className="flex justify-center gap-x-4">
                    <Link to={`/abogado/details/${abogado._id}`}>
                      <BsInfoCircle className="text-2x1 text-green-800" />
                    </Link>
                    <Link to={`/abogado/edit/${abogado._id}`}>
                      <AiOutlineEdit className="text-2x1 text-yellow-800" />
                    </Link>
                    <Link to={`/abogado/delete/${abogado._id}`}>
                      <MdOutlineDelete className="text-2x1 text-red-800" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListAbogado;
