import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const BarraNavegador = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const { logout } = useLogout();
  const { userAbogado } = useAuthContext();

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  const handleClick = () => {
    logout();
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Clientes", link: "/client/" },
    { id: 2, text: "Abogados", link: "/abogado/" },
    { id: 3, text: "Reuniones", link: "/reunion/" },
    { id: 4, text: "Casos", link: "/caso" },
    // { id: 5, text: "Signup", link: "/signup" },
  ];

  return (
    <div className="bg-white flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black">
      {/* Logo */}

      <h1 className="w-full text-3xl font-bold text-black">
        <a href={"/"}> Herramienta </a>
      </h1>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          >
            <a href={item.link}> {item.text}</a>
          </li>
        ))}
      </ul>
      {!userAbogado && (
        <div>
          <ul className="hidden md:flex">
            <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black">
              <a href={"/login"}> Login </a>
            </li>
          </ul>
        </div>
      )}
      {!userAbogado && (
        <div>
          <ul className="hidden md:flex">
            <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black">
              <a href={"/signup"}> Signup </a>
            </li>
          </ul>
        </div>
      )}
      <nav>
        {userAbogado && (
          <div>
            <ul className="hidden md:flex">
              <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black">
                <span> {userAbogado.email}</span>
                <button onClick={handleClick}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        {/* Mobile Logo */}
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          Herramienta
        </h1>

        {/* Mobile Navigation Items */}
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border-b rounded-x3 hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarraNavegador;
