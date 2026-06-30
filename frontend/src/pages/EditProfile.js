import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/log.png";
import Navbar from "../components/NavbarRegister"; 
import socket from "../socket";

export default function EditProfile() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    sexe: "",
    cin: "",
    adresse: "",
    email: "",
    phone: "",
    role: "",
  });

  // Fakana ny mombamomba ny mpampiasa ankehitriny
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      // Fantarina tsara hoe aiza no misy ilay role ao amin'ny localStorage (role sa id_role)
      const userRole = user.role || user.id_role || "";
      
      setFormData({
        nom: user.nom || user.nom_user || "",
        prenom: user.prenom || user.prenom_user || "",
        age: user.age || "",
        sexe: user.sexe || "",
        cin: user.cin || "",
        adresse: user.adresse || "",
        email: user.email || "",
        phone: user.phone || "",
        role: userRole.toString(), // Avadika string foana mba hifanaraka amin'ny <option>
      });
    }
  }, []);

  // Fampifandraisana amin'ny Socket
  useEffect(() => {
    if (!user) return;

    socket.emit("registerUser", user.id || user.id_user);

    socket.on("approved", (data) => {
      alert(data.message);
      if (data.message.includes("approuvé")) {
        navigate("/");
      }
    });

    return () => {
      socket.off("approved");
    };
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Antoka farany hahazoana ny role raha sendra banga
    const finalRole = formData.role || (user && (user.role || user.id_role))?.toString() || "";

    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: finalRole
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profil mis à jour avec succès !");
        
        // Havaozina ny angon-drakitra ao amin'ny localStorage (tsy misy mdp)
        localStorage.setItem("user", JSON.stringify({ 
          ...user, 
          ...formData, 
          role: finalRole
        }));

        setTimeout(() => {
          navigate("/dashboard"); 
        }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur, réessayez plus tard");
    }
  };

  return (
    <div className="h-screen flex pt-24 justify-center items-center font-[Segoe_UI] bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* TOAST */}
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-xl animate-bounce z-[999999]">
          {message}
        </div>
      )}

      <div className="w-[80%] mt-2 max-w-sm md:max-w-[800px] bg-white dark:bg-gray-800 rounded-xl flex flex-col md:flex-row overflow-hidden shadow-2xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-400 relative flex-col justify-center items-center text-white rounded-tr-[120px] rounded-br-[120px] overflow-hidden">
          <div className="z-10 -mt-20 text-center">
            <img src={logo} alt="logo" className="w-[90px] mx-auto rounded-lg" />
            <h1 className="text-2xl font-bold text-gray-100 mt-3">Modifier le profil</h1>
            <p className="text-sm mt-2">Mettez à jour vos informations personnelles pour la gestion du matériel.</p>
          </div>
          <div className="absolute w-[300px] h-[300px] bg-blue-300 rounded-full blur-sm bottom-[-120px] left-[-120px] animate-pulse"></div>
          <div className="absolute w-[160px] h-[160px] bg-blue-400 rounded-full blur-sm bottom-10 left-28 animate-pulse delay-1000"></div>
          <div className="absolute w-[100px] h-[100px] bg-blue-200 rounded-full blur-sm top-8 right-10 animate-pulse delay-2000"></div>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="mb-4 text-lg md:text-xl font-bold text-blue-500 text-center md:text-left">Modifier vos informations</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center md:items-start">
            {step === 1 && (
              <>
                <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white" />
                <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white" />
                <input type="number" name="age" placeholder="Âge" min="0" value={formData.age} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white" />

                <select name="sexe" value={formData.sexe} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white">
                  <option value="">Sexe</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>

                <input type="text" name="cin" placeholder="CIN"
                  value={formData.cin}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    let formatted = value.match(/.{1,3}/g)?.join("-") || "";
                    if (formatted.length > 15) formatted = formatted.slice(0, 15);
                    setFormData({ ...formData, cin: formatted });
                  }}
                  required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 3) {
                      const prefix = value.substring(0, 3);
                      if (!["032","033","034","037","038"].includes(prefix)) value = "";
                    }
                    let formatted = "";
                    if (value.length > 0) formatted += value.substring(0,3);
                    if (value.length > 3) formatted += " " + value.substring(3,5);
                    if (value.length > 5) formatted += " " + value.substring(5,8);
                    if (value.length > 8) formatted += " " + value.substring(8,10);
                    setFormData({ ...formData, phone: formatted });
                  }}
                  maxLength="13"
                  required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white"
                />

                <button type="button" onClick={() => setStep(2)}
                  className="w-full md:w-4/5 p-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                  Suivant
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white" />
                <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} required
                  className="p-1 rounded-lg border border-gray-300 focus:border-blue-600 w-full md:w-4/5 dark:bg-gray-700 dark:text-white" />

                {/* Rafitra fampisehoana ny Rôle na inona na inona karazany avy any amin'ny LocalStorage */}
                <select 
                  name="role" 
                  value={
                    formData.role === "Administrateur" || formData.role === "1" ? "1" :
                    formData.role === "Direction" || formData.role === "2" ? "2" :
                    formData.role === "Gestionnaire de Stock" || formData.role === "3" ? "3" :
                    formData.role === "Personnel Médical" || formData.role === "4" ? "4" :
                    formData.role === "Pharmacien" || formData.role === "5" ? "5" :
                    formData.role === "Technicien" || formData.role === "6" ? "6" :
                    formData.role === "Agent Administratif" || formData.role === "7" ? "7" :
                    formData.role === "Agent de Service" || formData.role === "8" ? "8" : formData.role
                  } 
                  onChange={handleChange} 
                  required
                  className="p-1 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 w-full md:w-4/5 pointer-events-none select-none dark:bg-gray-700 dark:text-gray-400"
                >
                  <option value="">Choisir un rôle</option>
                  <option value="1">Administrateur</option>
                  <option value="2">Direction</option>
                  <option value="3">Gestionnaire de Stock</option>
                  <option value="4">Personnel Médical</option>
                  <option value="5">Pharmacien</option>
                  <option value="6">Technicien</option>
                  <option value="7">Agent Administratif</option>
                  <option value="8">Agent de Service</option>
                </select>

                <div className="flex flex-col gap-3 mt-3 w-full md:w-4/5">
                  <button type="button" onClick={() => setStep(1)}
                    className="p-1 border border-green-600 text-white bg-green-600 rounded-lg font-bold hover:bg-green-700">
                    Retour
                  </button>
                  <button type="submit"
                    className="p-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                    Enregistrer
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}