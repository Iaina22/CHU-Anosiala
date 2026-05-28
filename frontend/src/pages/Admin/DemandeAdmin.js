import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import { getAllDemandes } from "../../services/demandeService";
import { useNavigate } from "react-router-dom";

export default function AdminDemandes() {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchDemandes = async () => {
    try {
      const res = await getAllDemandes();
      const data = Array.isArray(res) ? res : res?.data || [];
      setDemandes(data);
    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {
  fetchDemandes();

  const interval = setInterval(() => {
    fetchDemandes();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  // ================= GROUP SAFE =================
  const grouped = (demandes || []).reduce((acc, item) => {
    const key = item.demande_group || `single-${item.id}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  // ================= STATS =================
  const total = Object.keys(grouped).length;

  const enAttente = Object.values(grouped).filter(
    (g) => g[0]?.status === "en attente"
  ).length;

  const valide = Object.values(grouped).filter(
    (g) => g[0]?.status === "validé"
  ).length;

  const refuse = Object.values(grouped).filter(
    (g) => g[0]?.status === "refusé"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="p-4 pt-24">
        {/* TITLE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
             Gestion des demandes
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Liste des demandes envoyées
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total
            </p>

            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
              {total}
            </h2>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl shadow border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              En attente
            </p>

            <h2 className="text-3xl font-bold text-yellow-800 dark:text-yellow-300 mt-1">
              {enAttente}
            </h2>
          </div>

          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl shadow border border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-400 text-sm">
              Validées
            </p>

            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
              {valide}
            </h2>
          </div>

          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-2xl shadow border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400 text-sm">
              Refusées
            </p>

            <h2 className="text-3xl font-bold text-red-800 dark:text-red-300 mt-1">
              {refuse}
            </h2>
          </div>
        </div>

        {/* ================= EMPTY ================= */}
        {Object.keys(grouped).length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center text-gray-500 dark:text-gray-400">
            Aucune demande trouvée
          </div>
        )}

        {/* ================= TABLE ================= */}
        {Object.keys(grouped).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead className="bg-blue-600 dark:bg-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Numero de Demande
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Nom
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Rôle
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Produits
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Statut
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(grouped).map(
                    ([groupId, items], index) => (
                      <tr
                        key={groupId}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                      >
                        {/* ID */}
                        <td className="px-4 py-4 font-bold text-blue-600 dark:text-blue-400">
                          #{index + 1}
                        </td>

                        {/* NOM */}
                        <td className="px-4 py-4 text-gray-700 dark:text-gray-200 font-medium">
                          {items[0]?.prenom || "N/A"}
                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            {items[0]?.role || "N/A"}
                          </span>
                        </td>

                        {/* PRODUITS */}
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                          {items.length} produit(s)
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold
                            ${
                              items[0]?.status === "validé"
                                ? "bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                : items[0]?.status === "refusé"
                                ? "bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                : "bg-yellow-200 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                            }`}
                          >
                            {items[0]?.status || "en attente"}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {items[0]?.timestamp
                            ? new Date(
                                items[0].timestamp
                              ).toLocaleString()
                            : "-"}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/admin/demandes/${groupId}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >
                            Voir détail
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}