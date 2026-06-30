import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";
import { FiMenu } from "react-icons/fi";

function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 1. State hitahiry ny isan'ny demande vaovao
  const [notifCount, setNotifCount] = useState(0);

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

  // 2. useEffect hakana ny isan'ny demande vaovao avy any amin'ny Backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Soloy ny URL-nao marina eto rehefa vonona ny backend-nao
        // const res = await fetch("http://localhost:5000/api/demandes/count-unread");
        // const data = await res.json();
        // setNotifCount(data.count);
        
        // Eto aloha natao simulation hoe misy 5 d'abord hahitanao azy
        setNotifCount(5); 
      } catch (error) {
        console.error("Erreur de récupération des notifications:", error);
      }
    };

    fetchNotifications();
    
    // Azonao asiana setInterval eto raha te hanao short polling ianao (isaky ny 30s ohatra)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
          <Link to="/article" className="text-blue-600 hover:text-blue-700 hover:underline">
            Articles
          </Link>
        </li>
        <li className="hidden md:block">
          <Link to="/stockSuivi" className="text-blue-600 hover:text-blue-700 hover:underline">
            Stock
          </Link>
        </li>
        <li className="hidden md:block">
          <Link to="/adminhome" className="text-blue-600 hover:text-blue-700 hover:underline">
            Utilisateurs 
          </Link>
        </li>
        
        {/* DEMANDES PC (Misy Badge) */}
        <li className="hidden md:block">
          <Link to="/demandeAdmin" className="relative text-blue-600 hover:text-blue-700 hover:underline pr-2">
            Demandes
            {/* Boribori mena ho an'ny PC */}
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notifCount}
              </span>
            )}
          </Link>
        </li>

        {/* Hamburger menu for phone (black text) */}
        <li className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black dark:text-white relative p-1"
          >
            <FiMenu className="w-6 h-6" />
            {/* Boribori mena kely eo ambonin'ny kisary Hamburger rehefa mihidy ny menu */}
            {!menuOpen && notifCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-2 min-w-[150px]">
              <Link to="/article" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Articles
              </Link>
              <Link to="/mouvements" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Entrées / Sorties
              </Link>
              <Link to="/adminhome" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Utilisateurs
              </Link>
              
              {/* DEMANDES PHONE (Misy Badge ao anaty menu) */}
              <Link 
                to="/demandeAdmin" 
                onClick={() => setMenuOpen(false)} 
                className="text-blue-600 dark:text-white hover:underline flex justify-between items-center"
              >
                <span>Demandes</span>
                {notifCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
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