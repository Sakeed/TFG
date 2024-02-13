import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import BarraNavegador from "../../components/BarraNavegador";

const CreateCaso = () => {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [abogado_id, setAbogado_id] = useState("");
  const [cliente_id, setCliente_id] = useState("");
  const [facturacion, setFacturacion] = useState("");
  const [user_id, setUser_Id] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userAbogado } = useAuthContext();

  // Lista de clientes y cliente seleccionado
  const [clients, setClients] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lista de abogados y cliente seleccionado
  const [abogados, setAbogados] = useState([]);
  const [abogadoSeleccionado, setAbogadoSeleccionado] = useState(null);
  const [searchTerm2, setSearchTerm2] = useState("");

  const handleSaveCaso = () => {
    const data = {
      descripcion,
      abogado_id,
      tipo,
      cliente_id,
      facturacion,
      user_id,
    };
    setLoading(true);
    if (userAbogado) {
      axios
        .post("http://localhost:3001/caso", data, {
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
    } else {
      console.log("No identificado");
    }
  };

  // Conseguir la lista de clientes
  useEffect(() => {
    setLoading(true);
    if (userAbogado) {
      axios
        .get("http://localhost:3001/client", {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        })
        .then((response) => {
          setClients(response.data.data);
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

  //Conseguir la lista de abogados
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

  //Click de la lista de clientes
  const handleClienteClick = (cliente) => {
    setClienteSeleccionado(cliente);
    setCliente_id(cliente._id);
  };

  //Click de la lista de abogados
  const handleAbogadoClick = (abogado) => {
    setAbogadoSeleccionado(abogado);
    setAbogado_id(abogado._id);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setSearchTerm2(event.target.value);
  };

  //Clientes filtrados
  const filteredClients = searchTerm
    ? clients.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  //Abogados filtrados
  const filteredAbogados = searchTerm2
    ? abogados.filter((abogado) =>
        abogado.nombre.toLowerCase().includes(searchTerm2.toLowerCase())
      )
    : [];

  return (
    <div className="p-4">
      <BackButton />
      <BarraNavegador />
      <h1 className="text-3xl my-4">Nuevo caso</h1>
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

        {/* Creando el scroll de la lista de abogados de la base de datos*/}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Abogado asignado</label>
          <input
            type="text"
            placeholder="Buscar abogado..."
            value={searchTerm2}
            onChange={handleInputChange2}
            className="border-2 border-gray-500 px-4 py-2  w-full"
          />
          <ul className="border-2 border-gray-500 p-4">
            {filteredAbogados.slice(0, 5).map((abogado) => (
              <li key={abogado._id} className="mb-2">
                <button
                  className={`py-2 px-4 border-2 border-gray-300 rounded-md ${
                    abogadoSeleccionado &&
                    abogadoSeleccionado._id === abogado._id
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() => handleAbogadoClick(abogado)}
                >
                  {abogado.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Creando el scroll de la lista de clientes de la base de datos*/}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Cliente asignado</label>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={handleInputChange}
            className="border-2 border-gray-500 px-4 py-2  w-full"
          />
          <ul className="border-2 border-gray-500 p-4">
            {filteredClients.slice(0, 5).map((cliente) => (
              <li key={cliente._id} className="mb-2">
                <button
                  className={`py-2 px-4 border-2 border-gray-300 rounded-md ${
                    clienteSeleccionado &&
                    clienteSeleccionado._id === cliente._id
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() => handleClienteClick(cliente)}
                >
                  {cliente.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Facturacion del caso
          </label>
          <input
            type="text"
            value={facturacion}
            onChange={(e) => setFacturacion(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>

        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveCaso}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateCaso;
