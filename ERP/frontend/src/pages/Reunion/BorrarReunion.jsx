import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";

const BorrarReunion = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDeleteReunion = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3001/reunion/${id}`)
      .then(() => {
        navigate("/reunion");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Un error ha ocurrido");
        console.log(error);
      });
  };
  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Delete reunion</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
        <h3 className="text-2xl">
          Are You Sure You want to delete this reunion?
        </h3>

        <button
          className="p-4 bg-red-600 text-white m-8 w-full"
          onClick={handleDeleteReunion}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default BorrarReunion;
