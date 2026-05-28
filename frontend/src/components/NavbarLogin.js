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
      className="fixed top-2 left-1/2 -translate-x-1/2 w-[90%] z-[1000] 
                 flex justify-between items-center px-4 py-2
                 md:bg-white/65 md:backdrop-blur-md md:border md:border-black/10 md:rounded-xl md:shadow-md
                 transition duration-300
                 dark:md:bg-[rgba(30,30,30,0.6)] dark:md:border dark:md:border-white/20"
    >
      {/* LOGO */}
      <Link to="/" className="flex flex-col items-center no-underline">
        <img src={logo} alt="logo" className="w-[60px] md:w-[90px]" />
        <h1 className="text-black dark:text-white text-[12px] md:text-[16px] font-bold mt-1 mb-0">
          CHU Anosiala
        </h1>
      </Link>

      {/* LINKS */}
      <ul className="flex gap-4 items-center">
         <Link to="/Register" className="px-6 py-2 bg-white text-[#0f5ed7] border-2 border-[#0f5ed7] rounded-lg font-bold hover:opacity-90">
          S'inscrire
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
