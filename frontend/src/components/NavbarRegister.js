import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";

function Navbar() {
   const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});

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
                 md:left-1/2 md:-translate-x-1/2 md:w-[90%] 
                 md:bg-white/70 md:backdrop-blur-md md:border md:border-black/10 md:rounded-xl md:shadow-md
                 transition duration-300
                 dark:md:bg-gray-800 dark:md:border-white/20"
    >
      {/* LOGO */}
      <Link to="/" className="flex flex-col items-center no-underline">
        <img src={logo} alt="logo" className="w-[50px] md:w-[90px]" />
        <h1 className="text-black dark:text-white text-[12px] md:text-[16px] font-bold mt-1 mb-0">
          CHU Anosiala
        </h1>
      </Link>

      {/* LINKS */}
      <ul className="flex gap-4 items-center">
        <Link
          to="/Login"
          className="px-2 py-1 md:px-6 md:py-2 
                     bg-transparent text-blue-600 border border-blue-600 
                     rounded-md md:rounded-lg font-bold 
                     text-xs md:text-base hover:bg-blue-600 hover:text-white transition"
        >
          se connecter
        </Link>

        <li
          onClick={toggleTheme}
          className="cursor-pointer flex items-center"
        >
          {theme === "light" ? <Moon size={18} className="md:w-[22px]" /> : <Sun size={18} className="md:w-[22px]" />}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
