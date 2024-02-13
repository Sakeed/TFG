import { useState } from "react";
import BarraNavegador from "../components/BarraNavegador";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="p-4">
      <BarraNavegador />
      <form className="text-3xl my-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl my-4 text-center">Login</h1>
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Email:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button disabled={isLoading} className="p-2 bg-sky-300 m-8">
            Login
          </button>
          {error}
        </div>
      </form>
    </div>
  );
};

export default Login;
