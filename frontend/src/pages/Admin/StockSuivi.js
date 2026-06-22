import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavbarAdmin";

const HistoriquePage = () => {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des données depuis l'API Backend
  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/historique"); // Ajustez le PORT si nécessaire
        const result = await response.json();
        
        if (result.success) {
          setHistoriques(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Impossible de contacter le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Chargement de l'historique...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-lg max-w-md shadow-sm border border-red-200 dark:border-red-800">
          Erreur : {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Historique & Suivi des Mouvements
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Suivi en temps réel des entrées et sorties de stock (Espace Admin)
          </p>
        </div>

        {/* Conteneur du Tableau - Responsive (overflow-x-auto) */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Date & Heure</th>
                  <th className="p-4">Article</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Stock Préc.</th>
                  <th className="p-4 text-center">Flux (Qté)</th>
                  <th className="p-4 text-right">Stock Actuel</th>
                  <th className="p-4">Demandeur / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm text-gray-600 dark:text-gray-300">
                {historiques.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-400 dark:text-gray-500">
                      Aucun mouvement enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  historiques.map((h) => {
                    const isEntree = h.type_mouvement === "ENTREE";

                    return (
                      <tr 
                        key={h.id} 
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        {/* 1. Date */}
                        <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(h.timestamp).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>

                        {/* 2. Article */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 dark:text-white">{h.produit}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 max-w-xs truncate">{h.designation || "-"}</div>
                        </td>

                        {/* 3. Type (Badge design) */}
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md ${
                              isEntree
                                ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/60"
                                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60"
                            }`}
                          >
                            {isEntree ? "ENTRÉE" : "SORTIE"}
                          </span>
                        </td>

                        {/* 4. Stock Précédent */}
                        <td className="p-4 text-right font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {h.stock_recent}
                        </td>

                        {/* 5. Quantité Mouvementée (Lumière dynamique) */}
                        <td
                          className={`p-4 text-center font-bold text-base whitespace-nowrap ${
                            isEntree ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isEntree ? `+${h.quantite_mvmt}` : `-${h.quantite_mvmt}`}
                        </td>

                        {/* 6. Stock Actuel */}
                        <td className="p-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/30 dark:bg-gray-700/10 whitespace-nowrap">
                          {h.stock_actuel}
                        </td>

                        {/* 7. Demandeur */}
                        <td className="p-4 text-gray-700 dark:text-gray-300 italic whitespace-nowrap">
                          {isEntree ? (
                            <span className="text-gray-400 dark:text-gray-500 text-xs not-italic">Approvisionnement</span>
                          ) : (
                            h.demandeur || "Non spécifié"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoriquePage;