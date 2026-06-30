import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiSearch, FiSettings } from "react-icons/fi";

const HistoriquePage = () => {
  const [historiques, setHistoriques] = useState([]);
  const [filteredHistoriques, setFilteredHistoriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States ho an'ny sivana (Filters)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Récupération des données depuis l'API Backend
  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/historique");
        const result = await response.json();
        
        if (result.success) {
          setHistoriques(result.data);
          setFilteredHistoriques(result.data);
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

  // Fitantanana ny sivana (Filtering Logic)
  useEffect(() => {
    let data = [...historiques];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (h) =>
          h.produit?.toLowerCase().includes(term) ||
          h.designation?.toLowerCase().includes(term) ||
          h.demandeur?.toLowerCase().includes(term)
      );
    }

    if (filterType !== "ALL") {
      data = data.filter((h) => h.type_mouvement === filterType);
    }

    if (startDate) {
      data = data.filter((h) => new Date(h.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      data = data.filter((h) => new Date(h.timestamp) <= end);
    }

    setFilteredHistoriques(data);
  }, [searchTerm, filterType, startDate, endDate, historiques]);

  // EXPORT EXCEL
  const exportToExcel = () => {
    const dataToExport = filteredHistoriques.map((h) => ({
      "Date & Heure": new Date(h.timestamp).toLocaleString("fr-FR"),
      "Article": h.produit,
      "Désignation": h.designation || "-",
      "Type Mouvement": h.type_mouvement,
      "Stock Précédent": h.stock_recent,
      "Flux (Quantité)": h.type_mouvement === "ENTREE" ? `+${h.quantite_mvmt}` : `-${h.quantite_mvmt}`,
      "Stock Actuel": h.stock_actuel,
      "Demandeur / Source": h.type_mouvement === "ENTREE" ? "Approvisionnement" : h.demandeur || "Non spécifié",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(fileData, `Historique_Stock_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // EXPORT PDF
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Historique & Suivi des Mouvements de Stock", 14, 15);
    
    const tableRows = filteredHistoriques.map((h) => [
      new Date(h.timestamp).toLocaleString("fr-FR"),
      `${h.produit} ${h.designation ? `(${h.designation})` : ""}`,
      h.type_mouvement,
      h.stock_recent,
      h.type_mouvement === "ENTREE" ? `+${h.quantite_mvmt}` : `-${h.quantite_mvmt}`,
      h.stock_actuel,
      h.type_mouvement === "ENTREE" ? "Approvisionnement" : h.demandeur || "Non spécifié"
    ]);

    doc.autoTable({
      head: [["Date & Heure", "Article", "Type", "Stock Préc.", "Flux", "Stock Actuel", "Demandeur / Source"]],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] }
    });

    doc.save(`Historique_Stock_${new Date().toISOString().slice(0,10)}.pdf`);
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    
      <div className="w-full relative z-50">
        <Navbar />
      </div>
      
      
      <div className="w-full mt-10 flex-1 pt-24 p-4 sm:p-6 md:p-8">
        
        {/* HEADER FLEX WITH SEARCH & SETTINGS ICON */}
        <div className="mb-8 mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl   sm:text-2xl font-bold text-blue-600 dark:text-blue-500">
              Historique & Suivi des Mouvements
            </h1>
          
          </div>

          {/* SEARCH BAR + PARAMETER ICON ROW */}
          <div className="flex items-center gap-3 w-full lg:w-auto relative">
            {/* SEARCH */}
            <div className="flex-1 lg:w-72 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
              <FiSearch className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-900 dark:text-white text-sm"
                placeholder="Recherche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SETTINGS ICON BUTTON */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiSettings className="text-xl" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-fade-in">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 border-b pb-2">
                    Filtres & Options d'Export
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    {/* Karazany */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Type de Mouvement</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                      >
                        <option value="ALL" className="dark:bg-gray-800">Tous les mouvements</option>
                        <option value="ENTREE" className="dark:bg-gray-800">ENTRÉE</option>
                        <option value="SORTIE" className="dark:bg-gray-800">SORTIE</option>
                      </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Début</span>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fin</span>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Export buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button 
                        type="button" 
                        onClick={() => { exportToExcel(); setShowSettings(false); }} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs w-full hover:bg-green-700 transition font-semibold"
                      >
                        Excel
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { exportToPDF(); setShowSettings(false); }} 
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs w-full hover:bg-red-700 transition font-semibold"
                      >
                        PDF
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-blue-500 dark:bg-blue-300 border-b border-gray-300 dark:border-gray-700 text-white dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Date & Heure</th>
                  <th className="p-4">Article</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Stock Préc.</th>
                  <th className="p-4 text-center">Flux (Qté)</th>
                  <th className="p-4 text-right">Stock Actuel</th>
                
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm text-gray-600 dark:text-gray-300">
                {filteredHistoriques.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-400 dark:text-gray-500">
                      Aucun mouvement ne correspond aux critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredHistoriques.map((h) => {
                    const isEntree = h.type_mouvement === "ENTREE";

                    return (
                      <tr 
                        key={h.id} 
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(h.timestamp).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 dark:text-white">{h.produit}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 max-w-sm truncate">{h.designation || "-"}</div>
                        </td>

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

                        <td className="p-4 text-right font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {h.stock_recent}
                        </td>

                        <td
                          className={`p-4 text-center font-bold text-base whitespace-nowrap ${
                            isEntree ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isEntree ? `+${h.quantite_mvmt}` : `-${h.quantite_mvmt}`}
                        </td>

                        <td className="p-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/30 dark:bg-gray-700/10 whitespace-nowrap">
                          {h.stock_actuel}
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