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
  
  // États pour les notifications
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // Récupération des données depuis l'API globale
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications");
      const data = await res.json();
      
      setNotifCount(data.count || 0); 
      setNotifList(data.notifications || []);
    } catch (error) {
      console.error("Erreur de récupération des notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Short polling : actualisation automatique toutes les 10 secondes
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // === DINGANA LEHIBE: REHEFA TSINDRINA ILAY APPAREIL DE REHEFA SOKAFANA ILAY DROPDOWN ===
  const handleDropdownToggle = async () => {
    // Sokafana na akatona ny dropdown visual
    setDropdownOpen(!dropdownOpen);

    // Raha mbola tsy misokatra ilay dropdown nefa misy notification mbola tsy vakiana (notifCount > 0)
    if (!dropdownOpen && notifCount > 0) {
      try {
        // 1. Antsoina ny API any amin'ny backend mba hanova ny is_read ho true
        await fetch("http://localhost:5000/api/notifications/read", {
          method: "PUT",
        });
        
        // 2. Foanana avy hatrany ny count sy ny lisitry ny soratra eo amin'ny écran (visuel)
        setNotifCount(0);
        setNotifList([]);
        
      } catch (error) {
        console.error("Erreur lors du marquage des notifications comme lues:", error);
      }
    }
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
        {/* PC links */}
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
        
        {/* DEMANDES PC (Style Facebook miaraka amin'ny Dropdown) */}
        <li className="hidden md:block relative">
          <button 
            onClick={handleDropdownToggle}
            className="relative text-blue-600 hover:text-blue-700 hover:underline pr-4 font-semibold focus:outline-none"
          >
            Demandes
            {notifCount > 0 && (
              <span className="absolute top-[-6px] right-[-4px] bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-sm">
                {notifCount}
              </span>
            )}
          </button>

          {/* LISTE DÉROULANTE AN'IREO MESSAGES */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50 text-sm font-normal text-left">
              <div className="px-4 py-2 font-bold border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-white">
                Notifications
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifList.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 m-0">Aucune notification</p>
                ) : (
                  notifList.map((notif) => (
                    <Link
                      to="/demandeAdmin"
                      key={notif.id}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition no-underline bg-blue-50/40 dark:bg-gray-700/50 font-medium"
                    >
                      <p className="text-gray-800 dark:text-gray-200 m-0 text-xs leading-tight">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {new Date(notif.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              <Link 
                to="/demandeAdmin" 
                onClick={() => setDropdownOpen(false)} 
                className="block text-center text-xs text-blue-600 hover:underline pt-2 font-bold no-underline"
              >
                Voir toutes les demandes
              </Link>
            </div>
          )}
        </li>

        {/* Hamburger menu for mobile */}
        <li className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black dark:text-white relative p-1 flex items-center justify-center"
          >
            <FiMenu className="w-6 h-6" />
            {!menuOpen && notifCount > 0 && (
              <span className="absolute top-[-2px] right-[-2px] bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                {notifCount}
              </span>
            )}
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-2 min-w-[170px]">
              <Link to="/article" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Articles
              </Link>
              <Link to="/stockSuivi" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Stock
              </Link>
              <Link to="/adminhome" onClick={() => setMenuOpen(false)} className="text-blue-600 dark:text-white hover:underline">
                Utilisateurs
              </Link>
              <Link 
                to="/demandeAdmin" 
                onClick={async () => {
                  setMenuOpen(false);
                  // Ho an'ny Mobile ihany koa rehefa tsindrina dia foanana ny soratra sy ny badge
                  if(notifCount > 0) {
                    await fetch("http://localhost:5000/api/notifications/read", { method: "PUT" });
                    setNotifCount(0);
                    setNotifList([]);
                  }
                }} 
                className="text-blue-600 dark:text-white hover:underline flex justify-between items-center border-t pt-1 border-gray-100 dark:border-gray-700 no-underline"
              >
                <span>Demandes</span>
                {notifCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
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