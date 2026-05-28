import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; 
import gestionImg from "../assets/images/gestion.png";
import { Phone, Mail, MapPin } from "lucide-react";

import s1 from "../assets/images/labo.jpg";
import s2 from "../assets/images/entretien.jpg";
import s3 from "../assets/images/mobilier.jpeg";
import s4 from "../assets/images/pharmacie.jpeg";
import s5 from "../assets/images/transport.jpg";
import s6 from "../assets/images/informatique.avif";
import s7 from "../assets/images/technique.jpg";
import s8 from "../assets/images/technique.jpg";

/* ✅ FIX WARNING ONLY */
const slides = [
  { img: s1, text: " de laboratoire" },
  { img: s2, text: " d'entretien" },
  { img: s3, text: " de mobilier" },
  { img: s4, text: " pharmacitique" },
  { img: s5, text: "de transport" },
  { img: s6, text: " informatique" },
  { img: s7, text: " biomedical/technique" },
  { img: s8, text: " biomedical/technique" },
];

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []); // ✅ no warning (slides stable)

  return (
    <div className="min-h-screen flex flex-col items-center font-[Segoe_UI] scroll-smooth text-[14px] md:text-[16px]">
      <Navbar />

      {/* MAIN INTRO */}
      <div className="flex flex-col md:flex-row w-[90%] justify-between items-center mt-[18%] flex-1">
        {/* LEFT */}
        <div className="flex flex-col justify-center w-full md:w-[50%] mt-5 md:-mt-[10%]" id="articles">
          <h1 className="text-[24px] md:text-[36px] mb-2 text-[#0f5ed7] font-bold">Compta Matière CHU.</h1>
          <p className="text-[10px]  md:text-[18px] mb-8 text-gray ">
            Optimisez la gestion des matières hospitalières avec MediGestion.
            Notre application web vous permet de suivre avec précision les stocks et les mouvements de matériel au sein du CHU Anosiala.
            Assurez une traçabilité complète et une sécurité renforcée pour chaque matière médicale.
            Gagnez du temps et simplifiez les tâches administratives grâce à une interface intuitive et des fonctionnalités adaptées aux équipes hospitalières.
            Découvrez une solution moderne pour maîtriser vos stocks et améliorer la qualité des soins.
          </p>

                    <div className="flex gap-5">
            <Link
              to="/register"
              className="px-4 py-2 md:px-6 md:py-2 rounded-lg font-bold text-sm md:text-base
              bg-[#0f5ed7] text-white border-2 border-[#0f5ed7]
              dark:bg-cyan-600 dark:border-cyan-600 dark:text-white
              hover:opacity-90 dark:hover:bg-cyan-500
              transition-all duration-300 shadow-md hover:shadow-lg">
              Inscription
            </Link>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="flex flex-col items-center w-full md:w-[45%] mt-5 md:-mt-[10%]">
  
  <div className="mb-2 text-[14px] md:text-[18px]">
    <span className="text-gray-900 dark:text-gray-100 font-bold">
      Matériel :
    </span>

    <span className="text-[#0f5ed7] dark:text-cyan-300 font-bold ml-1">
      {slides[index].text}
    </span>
  </div>

  <img
    src={slides[index].img}
    alt="slide"
    className="w-full h-[220px] md:h-[320px] object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
  />

</div>
      </div>

    
{/* STOCK SECTION */}
<div
  id="stocks"
  className="w-[92%] md:w-[88%] mx-auto my-10 md:my-12 overflow-hidden rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
>
  <div className="flex flex-col md:flex-row">

    {/* IMAGE */}
    <div className="w-full md:w-[45%] relative">
      

        <img
          src={gestionImg}
          alt="Gestion Stock Hospitalier"
          className="w-full h-[260px] md:h-full object-cover"
        />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent" />

      <div className="absolute bottom-6 left-6 text-white">
        <h2 className="text-2xl md:text-3xl font-bold">
          Gestion de Stock
        </h2>

        <p className="text-sm md:text-base mt-2 text-gray-200">
          Contrôle intelligent des matériels médicaux
        </p>
      </div>
    </div>

    {/* CONTENT */}
    <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-center">

      

      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-tight">
        Suivi moderne des mouvements de stock hospitalier
      </h3>

      <p className="mt-5 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
        Gérez efficacement les entrées, sorties et disponibilités des équipements médicaux, médicaments et consommables grâce à une plateforme sécurisée et intuitive.
      </p>

      {/* FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">

        <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b]">
          <h4 className="font-bold text-[#0f5ed7] dark:text-cyan-300">
            📊 Suivi en temps réel
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Contrôle instantané des stocks disponibles.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b]">
          <h4 className="font-bold text-[#0f5ed7] dark:text-cyan-300">
            🔒 Sécurité des données
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Protection des informations hospitalières.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b]">
          <h4 className="font-bold text-[#0f5ed7] dark:text-cyan-300">
            ⚡ Gestion rapide
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Interface fluide et simple à utiliser.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b]">
          <h4 className="font-bold text-[#0f5ed7] dark:text-cyan-300">
            🏥 Adapté aux hôpitaux
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Pensé spécialement pour les établissements médicaux.
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

<div
  id="demandes"
  className="w-[90%] md:w-[85%] mx-auto my-8 md:my-4 p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
>
  {/* HEADER */}
  <div className="mb-6">
    <h2 className="text-xl md:text-2xl font-bold text-[#0f5ed7] dark:text-cyan-300">
      Gestion des Demandes de Matériel
    </h2>
    <div className="w-24 h-[3px] bg-gradient-to-r from-[#0f5ed7] to-green-500 mt-2 rounded-full"></div>
  </div>

  {/* CONTENT GRID */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* LEFT TEXT */}
    <div>
      <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-3">
        Module centralisé de gestion hospitalière
      </h3>

      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
        Les demandes de matériel médical sont envoyées par les services hospitaliers et suivies dans un système centralisé afin d’assurer une meilleure organisation et disponibilité des ressources.
      </p>

    </div>

    
    <div className="p-5 -mt-12 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-white dark:from-[#1e293b] dark:to-[#0f172a] border border-gray-200 dark:border-gray-700">

      <h4 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-3">
        Système de validation des demandes
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        Chaque demande est analysée et validée par l’administration avant traitement afin de garantir un contrôle optimal des stocks hospitaliers.
      </p>

      {/* SIMPLE SIMULATION */}
      <div className="space-y-3">

        <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
          <span className="text-sm text-green-700 dark:text-green-300">
            Demande #1024
          </span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-300">
            Validée
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
          <span className="text-sm text-orange-700 dark:text-orange-300">
            Demande #1025
          </span>
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-300">
            En attente
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
          <span className="text-sm text-red-700 dark:text-red-300">
            Demande #1026
          </span>
          <span className="text-xs font-semibold text-red-600 dark:text-red-300">
            Rejetée
          </span>
        </div>

      </div>
    </div>

  </div>
</div>
      
<div
  id="contacts"
  className="w-[90%] md:w-[85%] mx-auto my-8 md:my-12 p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
>
  {/* HEADER */}
  <h2 className="text-xl md:text-2xl font-bold text-[#0f5ed7] dark:text-cyan-300 mb-2">
    Contact & Informations
  </h2>

  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
    Assistance et informations pour la gestion du stock hospitalier.
  </p>

  {/* GRID */}
  <div className="grid md:grid-cols-3 gap-5">

    {/* PHONE */}
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition">
      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#0f5ed7] dark:text-cyan-300">
        <Phone size={20} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          Téléphone
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          +261 34 00 000 00
        </p>
      </div>
    </div>

    {/* EMAIL */}
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition">
      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#0f5ed7] dark:text-cyan-300">
        <Mail size={20} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          Email
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          contact@medigestion.hopital.mg
        </p>
      </div>
    </div>

    {/* ADDRESS */}
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition">
      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#0f5ed7] dark:text-cyan-300">
        <MapPin size={20} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          Adresse
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          CHU Anosiala, Antananarivo
        </p>
      </div>
    </div>

  </div>
</div>
    </div>
  );
}

export default Home;
