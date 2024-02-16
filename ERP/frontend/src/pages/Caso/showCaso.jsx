import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { BsArrowLeft } from "react-icons/bs";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import BarraNavegador from "../../components/BarraNavegador";

const ShowCaso = () => {
  const [caso, setCaso] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { userAbogado } = useAuthContext();
  const [facturacion, setFacturacion] = useState("");
  const [comentarios, setComentarios] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [casoActivo, setCasoActivo] = useState(true);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (userAbogado) {
      axios
        .get(`http://localhost:3001/caso/${id}`, {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        })
        .then((response) => {
          setCaso(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.log("No identificadooo");
    }
  }, [userAbogado, id]);

  //Editar la facturacion del caso

  const handleEditFacturacion = () => {
    const data = {
      facturacion: caso.facturacion + parseFloat(facturacion),
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
        navigate(`/caso/details/${caso._id}`);
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  //aÑADIR DOCUMENTOS

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:3001/caso/${id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userAbogado.token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

  //Descargar el documento

  const handleDownloadDocumento = async (documentoId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/caso/${id}/${documentoId}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        }
      );
      const contentType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: contentType });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `documento_${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Eliminar el enlace después de la descarga
    } catch (error) {
      console.log(error);
    }
  };

  //Borrar documento
  const handleDeleteDocumento = async (documentoId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/caso/${id}/${documentoId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${userAbogado.token}`,
          },
        }
      );

      console.log(response.data); // Mensaje de éxito de eliminación
      // Actualizar la interfaz de usuario según sea necesario
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      // Manejar errores de eliminación
    }
  };

  //Añadir comentarios

  const handleAddComentarios = () => {
    const nuevoComentario = {
      descripcion: comentarios, // Obtener el valor del estado de los comentarios
    };
    setLoading(true);
    axios
      .post(`http://localhost:3001/caso/${id}/comentarios`, nuevoComentario, {
        headers: {
          Authorization: `Bearer ${userAbogado.token}`,
        },
      })
      .then((response) => {
        // Actualizar el estado del caso con los comentarios actualizados
        setCaso((prevCaso) => ({
          ...prevCaso,
          comentarios: [...prevCaso.comentarios, response.data],
        }));

        setComentarios(""); // Limpiar el campo de comentarios
        setLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  //Cerrar el caso

  const handleCerrarCaso = () => {
    const updatedCasoActivo = false;
    const data = {
      casoActivo: updatedCasoActivo,
    };
    setCasoActivo(updatedCasoActivo);
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

  const handleAbrirCaso = () => {
    const updatedCasoActivo = true;
    const data = {
      casoActivo: updatedCasoActivo,
    };
    setCasoActivo(updatedCasoActivo);
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
      <BarraNavegador />
      <div className="flex justify-start items-center mb-4">
        <Link
          to={"/caso"}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg w-fit hover:bg-blue-600"
        >
          <BsArrowLeft className="text-2xl" />
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Detalles del Caso
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Descripción:
            </span>
            <p className="mt-2 text-gray-800">{caso.descripcion}</p>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Comentarios sobre el caso:
            </span>
            <div className="mt-2">
              {caso.comentarios?.map((comentario, index) => (
                <div
                  key={index}
                  className="border border-slate-900 rounded-md p-2 mb-2"
                >
                  <p className="text-gray-800">{comentario.descripcion}</p>
                </div>
              ))}
            </div>
            <br></br>
            <input
              type="text"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Introduzca el comentario"
              className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:border-blue-500 ml-2 w-full h-24 "
            />
            <button
              onClick={handleAddComentarios}
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
            >
              Añadir un comentario al caso
            </button>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Tipo de Caso:
            </span>
            <p className="mt-2 text-gray-800">{caso.tipo}</p>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Cliente Asignado:
            </span>
            <p className="mt-2 text-gray-800">{caso.cliente_id?.nombre}</p>
          </div>

          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Facturación Total del Caso:
            </span>
            <p className="mt-2 text-gray-800">
              {caso.facturacion} <span className="text-x2">€</span>
            </p>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Facturación Adicional:
            </span>
            <input
              type="number"
              value={facturacion}
              onChange={(e) => setFacturacion(e.target.value)}
              placeholder="Agregar a la facturación"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ml-2"
            />
            <button
              onClick={handleEditFacturacion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
            >
              Actualizar
            </button>
          </div>

          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Documentos:
            </span>
            <div className="mt-2">
              {caso.documentos?.map((documento, index) => (
                <div
                  key={index}
                  className="border border-slate-700 rounded-md p-2 mb-2"
                >
                  <p className="text-gray-800">
                    Nombre del Documento: {documento.nombre}
                  </p>
                  <p className="text-gray-800">
                    Fecha de Subida: {documento.fecha_subida}
                  </p>
                  <button
                    onClick={() => handleDownloadDocumento(documento._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
                  >
                    Descargar
                  </button>
                  <div>
                    <button
                      onClick={() => handleDeleteDocumento(documento._id)}
                    >
                      <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-800 transition duration-300 ease-in-out transform hover:scale-110" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <input type="file" onChange={fileSelectedHandler} />
            <button onClick={fileUploadHandler}>Subir archivo</button>
          </div>

          <div className="my-4">
            <span className="text-lg font-semibold text-gray-700">
              Reuniones:
            </span>
            <div className="mt-2">
              {caso.reunion?.map((reunion, index) => (
                <div
                  key={index}
                  className="border border-slate-700 rounded-md p-2 mb-2"
                >
                  <p className="text-gray-800">
                    Asunto de la reunión: {reunion.asunto}
                  </p>
                  <p className="text-gray-800">
                    Fecha de la Reunión: {reunion.fecha}
                  </p>
                  <div>
                    <Link
                      to={`/reunion/delete/${reunion._id}?casoId=${caso._id}`}
                    >
                      <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-800 transition duration-300 ease-in-out transform hover:scale-110" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Botón para crear nueva reunión */}
          <div className="mt-4">
            <Link
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600"
              to={`/reunion/create?casoId=${caso._id}`}
            >
              Crear nueva reunión
            </Link>
          </div>
          {caso.casoActivo ? (
            <div className="flex justify-center">
              <button
                onClick={handleCerrarCaso}
                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 "
              >
                Cerrar el caso
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleAbrirCaso}
                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 "
              >
                Abrir el caso
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowCaso;
