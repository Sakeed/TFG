import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Home from "./pages/Home";
import CreateClient from "./pages/Cliente/CreateClient";
import DeleteClient from "./pages/Cliente/DeleteClient";
import ShowClient from "./pages/Cliente/ShowClient";
import EditClient from "./pages/Cliente/EditClient";
import ListClients from "./pages/Cliente/ListClients";
import ListAbogado from "./pages/Abogado/ListAbogado";
import ShowAbogado from "./pages/Abogado/ShowAbogado";
import ListReunion from "./pages/Reunion/ListReunion";
import CrearReunion from "./pages/Reunion/CrearReunion";
import BorrarReunion from "./pages/Reunion/BorrarReunion";
import CreateCaso from "./pages/Caso/createCaso";
import ListCaso from "./pages/Caso/ListCaso";
import CasosAntiguos from "./pages/Caso/casosAntiguos";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ShowCaso from "./pages/Caso/showCaso";
import EditCaso from "./pages/Caso/editCaso";
import BorrarCaso from "./pages/Caso/borrarCaso";

const App = () => {
  const { userAbogado } = useAuthContext();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client/" element={<ListClients />} />
        <Route path="/client/create" element={<CreateClient />} />
        <Route path="/client/details/:id" element={<ShowClient />} />
        <Route path="/client/edit/:id" element={<EditClient />} />
        <Route path="/client/delete/:id" element={<DeleteClient />} />
      </Routes>
      <Routes>
        <Route path="/caso/" element={<ListCaso />} />
        <Route path="/caso/casosAntiguos" element={<CasosAntiguos />} />
        <Route path="/caso/create" element={<CreateCaso />} />
        <Route path="/caso/edit/:id" element={<EditCaso />} />
        <Route path="/caso/details/:id" element={<ShowCaso />} />
        <Route path="/caso/delete/:id" element={<BorrarCaso />} />
      </Routes>
      <Routes>
        <Route
          path="/login/"
          element={!userAbogado ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup/"
          element={!userAbogado ? <SignUp /> : <Navigate to="/" />}
        />
      </Routes>
      <Routes>
        <Route path="/abogado/" element={<ListAbogado />} />
        <Route path="/abogado/details/:id" element={<ShowAbogado />} />
      </Routes>
      <Routes>
        <Route path="/reunion/" element={<ListReunion />} />
        <Route path="/reunion/create" element={<CrearReunion />} />
        <Route path="/reunion/delete/:id" element={<BorrarReunion />} />
      </Routes>
    </div>
  );
};

export default App;
