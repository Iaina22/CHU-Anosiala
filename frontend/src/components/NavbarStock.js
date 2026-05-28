import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";
import { FiUser, FiMenu } from "react-icons/fi";

function Navbar() {
   const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});
  const [menuOpen, setMenuOpen] = useState(false);

 useEffect(() => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [theme]);


  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[1000]
                 flex justify-between items-center px-4 py-2
                 bg-gray-300 md:bg-white/70 md:backdrop-blur-md md:border md:border-black/10 md:rounded-xl md:shadow-md
                 transition duration-300
                 dark:bg-gray-900 dark:md:bg-gray-800 dark:md:border-white/20"
    >
      {/* LOGO */}
      <Link to="/" className="flex flex-col items-center no-underline">
        <img src={logo} alt="logo" className="w-[35px] md:w-[90px]" />
        <h1 className="text-black dark:text-white text-[10px] md:text-[16px] font-bold mt-1 mb-0">
          CHU Anosiala
        </h1>
      </Link>

      {/* RIGHT SIDE ICONS */}
      <ul className="flex gap-3 md:gap-6 items-center text-xs md:text-base font-semibold">
        {/* PC links (blue) */}
        <li className="hidden md:block">
          <Link to="/articles" className="text-blue-600 hover:text-blue-700 hover:underline">
            Articles
          </Link>
        </li>
        <li className="hidden md:block">
          <Link to="/mouvements" className="text-blue-600 hover:text-blue-700 hover:underline">
            Entrées / Sorties
          </Link>
        </li>
        <li className="hidden md:block">
          <Link to="/fournisseurs" className="text-blue-600 hover:text-blue-700 hover:underline">
            Fournisseurs
          </Link>
        </li>
        <li className="hidden md:block">
          <Link to="/demandes" className="text-blue-600 hover:text-blue-700 hover:underline">
            Demandes
          </Link>
        </li>

        {/* USER ICON */}
        <li>
          <FiUser className="w-4 h-4 md:w-6 md:h-6 text-black dark:text-white" />
        </li>

        {/* Hamburger menu for phone (black text) */}
        <li className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black dark:text-white"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-2">
              <Link to="/articles" onClick={() => setMenuOpen(false)} className="text-black dark:text-white hover:underline">
                Articles
              </Link>
              <Link to="/mouvements" onClick={() => setMenuOpen(false)} className="text-black dark:text-white hover:underline">
                Entrées / Sorties
              </Link>
              <Link to="/fournisseurs" onClick={() => setMenuOpen(false)} className="text-black dark:text-white hover:underline">
                Fournisseurs
              </Link>
              <Link to="/demandes" onClick={() => setMenuOpen(false)} className="text-black dark:text-white hover:underline">
                Demandes
              </Link>
            </div>
          )}
        </li>

        {/* DARK / LIGHT TOGGLE */}
        <li onClick={toggleTheme} className="cursor-pointer flex items-center">
          {theme === "light" ? (
            <Moon size={18} className="text-black md:w-[22px]" />
          ) : (
            <Sun size={18} className="text-blue-600 md:w-[22px]" />
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
