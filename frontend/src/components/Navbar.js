import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";
import { Link } from "react-router-dom";

function Navbar() {
 const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});
  const [open, setOpen] = useState(false);

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

  const handleOptionClick = () => {
    setOpen(false); // mikatona avy hatrany rehefa misafidy option
  };

  return (
    <nav
       className="fixed top-0 left-0 w-full z-[1000] 
                 flex justify-between items-center px-4 py-2
                 md:left-1/2 md:-translate-x-1/2 md:w-[90%] 
                 md:bg-white/65 md:backdrop-blur-md md:border md:border-black/10 md:rounded-xl md:shadow-md
                 transition duration-300
                 dark:md:bg-[rgba(30,30,30,0.6)] dark:md:border dark:md:border-white/20"
    >
      {/* LOGO */}
      <a href="#top" className="flex flex-col items-start no-underline">
        <img src={logo} alt="logo" className="w-[60px] md:w-[90px]" />
        <h1 className="text-[#020305] text-[14px] md:text-[16px] font-bold mt-1 mb-0">
          CHU Anosiala
        </h1>
      </a>

      {/* DESKTOP LINKS */}
      <ul className="hidden md:flex list-none gap-6 items-center">
        <li><a href="#articles" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Articles</a></li>
        <li><a href="#stocks" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Gestion des stock</a></li>
        <li><a href="#demandes" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Demandes</a></li>
        <li><a href="#contacts" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">Contacts</a></li>

            <Link
  to="/login"
  onClick={handleOptionClick}
  className="px-4 py-2 rounded-lg font-semibold text-sm md:text-base
  bg-blue-600 text-white border border-blue-600
  hover:bg-blue-700 hover:border-blue-700
  dark:bg-cyan-600 dark:border-cyan-600 dark:text-white
  dark:hover:bg-cyan-500
  transition-all duration-300 shadow-md"
>
  Connexion
</Link>
        <li onClick={toggleTheme} className="cursor-pointer flex items-center">
          {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
        </li>
      </ul>

      {/* MOBILE MENU TOGGLE */}
      <div className="flex md:hidden items-center gap-3">
        <button onClick={toggleTheme} className="cursor-pointer">
          {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
        </button>
        {/* Connexion fix couleur vert */}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Connexion
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl font-bold ml-2"
        >
          ≡
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-gray-200 dark:bg-[#2a2a2a] shadow-md md:hidden">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li><a href="#articles" onClick={handleOptionClick} className="text-blue-600 hover:text-blue-700 hover:underline">Articles</a></li>
            <li><a href="#stocks" onClick={handleOptionClick} className="text-blue-600 hover:text-blue-700 hover:underline ">Gestion des stock</a></li>
            <li><a href="#demandes" onClick={handleOptionClick} className="text-blue-600 hover:text-blue-700 hover:underline">Demandes</a></li>
            <li><a href="#contacts" onClick={handleOptionClick} className="text-blue-600 hover:text-blue-700 hover:underline ">Contacts</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
