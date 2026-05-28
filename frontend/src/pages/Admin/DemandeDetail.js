import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/NavbarAdmin";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDemandes ,updateDemandeStatus , updateDemande  } from "../../services/demandeService";
import { getArticles, updateArticle } from "../../services/articleService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function DemandeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatedQtyIds, setUpdatedQtyIds] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const demandeRes = await getAllDemandes();
      const demandeData = Array.isArray(demandeRes)
        ? demandeRes
        : demandeRes?.data || [];

      const filtered = demandeData.filter(
        (d) =>
          String(d.demande_group) === String(id) ||
          String(`single-${d.id}`) === String(id)
      );

      setDemandes(filtered);

      const articleRes = await getArticles();
      const articleData = Array.isArray(articleRes)
        ? articleRes
        : articleRes?.data || [];

      setArticles(articleData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔥 AUTO REFRESH PAGE
useEffect(() => {

  const interval = setInterval(() => {

    fetchData();

  }, 3000); 

  return () => clearInterval(interval);

}, [fetchData]);

  const first = demandes[0];

  // ================= STOCK =================
  const getStock = (produit) => {
    const article = articles.find(
      (a) =>
        String(a.nom || a.produit).toLowerCase().trim() ===
        String(produit).toLowerCase().trim()
    );

    return article?.quantite || 0; // ✅ ONLY quantite
  };
const updateQty = async (id, value) => {

  const qty = Number(value);

  // UPDATE FRONT
  setDemandes((prev) =>
    prev.map((d) =>
      d.id === id
        ? { ...d, quantiter: qty }
        : d
    )
  );

  // COLOR GREEN
  setUpdatedQtyIds((prev) => [
    ...new Set([...prev, id])
  ]);

  try {

    // 🔥 UPDATE DATABASE
    await updateDemande(id, {
      quantiter: qty,
    });

  } catch (err) {

    console.log(err);

  }

};
  // ================= GLOBAL VALIDATION =================
const setGlobalStatus = async (status) => {

  try {

    const updated = await Promise.all(

      demandes.map(async (d) => {

        const article = articles.find(
          (a) =>
            String(a.nom || a.produit)
              .toLowerCase()
              .trim() ===
            String(d.produit)
              .toLowerCase()
              .trim()
        );

        const stock = Number(article?.quantite || 0);

        const qty = Number(d.quantiter || 0);

        // ================= STOCK INSUFFISANT =================
        if (status === "validé" && stock < qty) {

          await updateDemandeStatus(
            d.id,
            "refusé"
          );

          return {
            ...d,
            status: "refusé",
          };
        }

        // ================= VALIDATION =================
        if (status === "validé") {

          const newStock = stock - qty;

          // UPDATE STOCK
          if (article) {

            await updateArticle(
              article.id,
              newStock
            );

            // 🔥 UPDATE STOCK DIRECT FRONT
            setArticles((prev) =>
              prev.map((a) =>
                a.id === article.id
                  ? {
                      ...a,
                      quantite: newStock,
                    }
                  : a
              )
            );
          }

          // UPDATE STATUS DEMANDE
          await updateDemandeStatus(
            d.id,
            "validé"
          );

          return {
            ...d,
            status: "validé",
          };
        }

        // ================= REFUS =================
        await updateDemandeStatus(
          d.id,
          "refusé"
        );

        return {
          ...d,
          status: "refusé",
        };

      })
    );

    // 🔥 UPDATE FRONT STATUS DIRECT
    setDemandes(updated);

    // 🔥 REFRESH DATA
    await fetchData();

    // 🔥 REDIRECT PAGE ADMIN
    navigate("/demandeAdmin");

  } catch (err) {

    console.log(err);

  }
};

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Demande", 14, 15);
    doc.text(`N°: ${first?.demande_group || first?.id}`, 14, 22);

    autoTable(doc, {
      startY: 35,
      head: [["Catégorie", "Produit", "Quantité", "Stock", "Désignation", "Status"]],
      body: demandes.map((d) => [
        d.categorie || "-",
        d.produit,
        d.quantiter,
        getStock(d.produit),
        d.designation,
        d.status || "en attente",
      ]),
    });

    doc.save(`demande_${first?.demande_group || first?.id}.pdf`);
  };

  // ================= EXCEL =================
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      demandes.map((d) => ({
        Catégorie: d.categorie || "-",
        Produit: d.produit,
        Quantité: d.quantiter,
        Stock: getStock(d.produit),
        Désignation: d.designation,
        Status: d.status || "en attente",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Demande");

    XLSX.writeFile(
      wb,
      `demande_${first?.demande_group || first?.id}.xlsx`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="p-4 pt-24 max-w-7xl mx-auto px-6 lg:px-12">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Détail demande
            </h1>
            <p className="text-gray-500 text-sm">
              Gestion demande et stock
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-2 py-1 text-xs rounded"
            >
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              PDF
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-800 text-white px-2 py-1 text-xs rounded"
            >
              Retour
            </button>
          </div>
        </div>

        {/* INFO */}
        {!loading && first && (
          <div className="mb-4 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

            <div>
              <p className="text-gray-500 text-xs">N°</p>
              <p className="font-bold text-blue-600">
                {first.demande_group || first.id}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Nom</p>
              <p>{first.prenom}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Rôle</p>
              <p>{first.role}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="text-xs">
                {first.timestamp
                  ? new Date(first.timestamp).toLocaleString()
                  : "-"}
              </p>
            </div>

          </div>
        )}

        {/* TABLE */}
        {!loading && demandes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 text-left">Catégorie</th>
                  <th className="p-2 text-left">Produit</th>
                  <th className="p-2 text-left">Quantité</th>
                  <th className="p-2 text-left">Stock</th>
                  <th className="p-2 text-left">Désignation</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {demandes.map((d) => (
                  <tr key={d.id} className="border-b dark:border-gray-700">

                    <td className="p-2">{d.categorie || "-"}</td>

                    <td className="p-2 font-bold text-blue-600">
                      {d.produit}
                    </td>

                                    <td
                        className={`p-2 ${
                          updatedQtyIds.includes(d.id)
                            ? "text-green-600 font-bold"
                            : ""
                        }`}
                      >
                                            
                          <input
                            type="number"
                            value={d.quantiter}
                            onChange={(e) =>
                              updateQty(d.id, e.target.value)
                            }
                            className={`w-20 p-1 border rounded dark:bg-gray-900 ${
                              updatedQtyIds.includes(d.id)
                                ? "border-green-500 text-green-600 font-bold"
                                : ""
                            }`}
                                        />
                    </td>

                    <td className="p-2 font-bold text-green-600">
                      {getStock(d.produit)}
                    </td>

                    <td className="p-2">{d.designation}</td>

                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        d.status === "validé"
                          ? "bg-green-100 text-green-700"
                          : d.status === "refusé"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {d.status || "en attente"}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {/* BUTTONS */}
            <div className="flex justify-end mt-3 gap-2">
              <button
                onClick={() => setGlobalStatus("validé")}
                className="bg-green-600 text-white px-3 py-1 text-xs rounded"
              >
                Validé
              </button>

              <button
                onClick={() => setGlobalStatus("refusé")}
                className="bg-red-600 text-white px-3 py-1 text-xs rounded"
              >
                Refusé
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}