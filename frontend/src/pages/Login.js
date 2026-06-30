import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import logo from "../assets/images/log.png"; 
import Navbar from "../components/NavbarLogin"; 

function Login() {
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 

    if (prenom === "Admin" && password === "azerty12") {
      navigate("/Adminhome");
      return;
    }

    if (prenom === "Stock" && password === "stock12") {
      navigate("/UserStock");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, mdp: password })
      });

      const data = await res.json();

      if (data.success) {
        // ================= SAVE USER =================
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "prenom",
          data.user.prenom
        );

        localStorage.setItem(
          "role",
          data.user.role
        );

        if (data.user.status === 'active') {
          localStorage.setItem("userId", data.user.id);
          setModal("✅ Connexion réussie !");
          setTimeout(() => {
            setModal('');
            setPrenom('');
            setPassword('');
            navigate("/UserArticle");
          }, 1500);
        } else if (data.user.status === 'pending') {
          setModal("⏳ Compte pas encore validé par l'administrateur");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else if (data.user.status === 'rejected') {
          setModal("❌ Compte refusé par l'admin");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        setModal("❌ Utilisateur introuvable ou mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      setModal("❌ Erreur serveur");
    }
  };

  return (
    <div className="h-screen flex pt-24 justify-center items-center font-[Segoe_UI] bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* TOAST (Mitovy tsara amin'ny Register) */}
      {modal && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-xl animate-bounce z-[999999]">
          {modal}
        </div>
      )}

      {/* MAIN CONTAINER (Mitovy lanja sy habe amin'ny Register) */}
      <div className="w-[80%] h-[65%] mt-2 max-w-sm md:max-w-[800px] bg-white dark:bg-gray-800 rounded-xl flex flex-col md:flex-row overflow-hidden shadow-2xl">

        
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-400 relative flex-col justify-center items-center text-white rounded-tr-[120px] rounded-br-[120px] overflow-hidden">
          <div className="z-10 -mt-20 text-center">
            <img src={logo} alt="logo" className="w-[90px] mx-auto rounded-lg" />
            <h1 className="text-2xl font-bold text-gray-100 mt-3">Ravi de vous revoir !</h1>
            <p className="text-sm mt-2">Connectez-vous pour accéder au suivi et à la gestion des matières de l’hôpital.</p>
          </div>
          {/* Circles animés */}
          <div className="absolute w-[300px] h-[300px] bg-blue-300 rounded-full blur-sm bottom-[-120px] left-[-120px] animate-pulse"></div>
          <div className="absolute w-[160px] h-[160px] bg-blue-400 rounded-full blur-sm bottom-10 left-28 animate-pulse delay-1000"></div>
          <div className="absolute w-[100px] h-[100px] bg-blue-200 rounded-full blur-sm top-8 right-10 animate-pulse delay-2000"></div>
        </div>

        {/* RIGHT SIDE - INPUTS (Mitovy amin'ny Register) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 ml-10 flex flex-col justify-center">
          <h2 className="mb-4 text-lg md:text-xl font-bold text-blue-500 text-center md:text-left">Connectez-vous !</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center md:items-start">
            
            <input 
              type="text" 
              placeholder="Prénom" 
              value={prenom} 
              onChange={(e) => setPrenom(e.target.value)} 
              required
              className="p-2 rounded-lg border border-gray-300  focus:border-blue-600 w-full md:w-4/5" 
            />

            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="p-2 rounded-lg border mt-4 border-gray-300 focus:border-blue-600 w-full md:w-4/5" 
            />

            {/* FORGOT PASSWORD */}
            <div className="w-full md:w-4/5 text-right">
              <Link to="/Mdpoublier" className="text-xs mt-2 text-green-700 dark:text-green-400 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              className="w-full md:w-4/5 p-1 bg-blue-600 mt-2 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Se connecter
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;