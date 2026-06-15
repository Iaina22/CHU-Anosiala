import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../components/NavbarLogin"; 

function Login() {
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
                }

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
    <div className="h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* ===== MODAL ===== */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center w-72">
            <p className="text-sm text-gray-800 dark:text-gray-200">{modal}</p>
            <button
              onClick={() => setModal('')}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ===== LOGIN CARD ===== */}
      <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-md p-8 -mt-20 md:mt-20 rounded-2xl w-72 text-center shadow-lg">
        <h2 className="mb-5 text-xl font-bold text-blue-500">Connectez-vous</h2>

        <div className="text-left mb-3">
          <label className="text-xs text-gray-600 dark:text-gray-300">Prénom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 mt-1 text-sm"
          />
        </div>

        <div className="text-left mb-3">
          <label className="text-xs text-gray-600 dark:text-gray-300">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 mt-1 text-sm"
          />
        </div>

        {/* ===== FORGOT PASSWORD ===== */}
        <div className="text-right mb-3">
          <Link to="/Mdpoublier" className="text-xs text-green-700 dark:text-green-400 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default Login;