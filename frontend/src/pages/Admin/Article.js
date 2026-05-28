import React, { useEffect, useState } from "react";

import Navbar from "../../components/NavbarAdmin";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  getArticles,
  addArticle,
  updateArticle,
} from "../../services/articleService";

import { getCategories } from "../../services/categorieService";

import { FiSearch, FiPlus } from "react-icons/fi";

export default function Article() {

  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    ref_cat: "",
    code_compta: "",
    produit: "",
    designation: "",
    stock: "",
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
      setAllArticles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= STATS =================

  const showAll = () => {
    setArticles(allArticles);
    setActiveFilter("ALL");
  };

  const showDisponible = () => {
    setArticles(
      allArticles.filter(
        (a) => Number(a.quantite ?? a.stock ?? 0) >= 10
      )
    );
    setActiveFilter("OK");
  };

  const showFaible = () => {
    setArticles(
      allArticles.filter(
        (a) =>
          Number(a.quantite ?? a.stock ?? 0) > 0 &&
          Number(a.quantite ?? a.stock ?? 0) < 10
      )
    );
    setActiveFilter("LOW");
  };

  const showRupture = () => {
    setArticles(
      allArticles.filter(
        (a) => Number(a.quantite ?? a.stock ?? 0) === 0
      )
    );
    setActiveFilter("ZERO");
  };

  // ================= CATEGORY =================

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    const selected = categories.find(
      (cat) => cat.ref_cat === value
    );

    if (!selected) return;

    setSelectedCategory(selected);

    setFormData((prev) => ({
      ...prev,
      ref_cat: selected.ref_cat,
      code_compta: selected.code_compta,
    }));

    setArticles(allArticles);
    setActiveFilter("ALL");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

     const existingArticle = allArticles.find(
  (a) =>
    a.produit?.trim().toLowerCase() ===
    formData.produit.trim().toLowerCase()
    &&
    a.ref_cat === formData.ref_cat
);

      if (existingArticle) {

        const currentQty = Number(
          existingArticle.quantite ?? existingArticle.stock ?? 0
        );

        const addQty = Number(formData.stock);

        const newStock = currentQty + addQty;

        await updateArticle(existingArticle.id, newStock);

      } else {

        await addArticle({
          ...formData,
          nom_cat: selectedCategory?.nom || "",
        });

      }

      await fetchArticles();

      setFormData({
        ref_cat: "",
        code_compta: "",
        produit: "",
        designation: "",
        stock: "",
      });

      setSelectedCategory(null);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= SEARCH =================

  const filteredArticles = articles.filter((article) =>
    article.designation
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= STATUS =================

  const getStatus = (stock) => {
    const qty = Number(stock ?? 0);

    if (qty === 0) {
      return { text: "Rupture", color: "bg-red-100 text-red-600" };
    }

    if (qty < 10) {
      return { text: "Faible", color: "bg-orange-100 text-orange-600" };
    }

    return { text: "Disponible", color: "bg-green-100 text-green-600" };
  };
  // ================= FILTER EXPORT =================

const [dateDebut, setDateDebut] = useState("");
const [dateFin, setDateFin] = useState("");
const [selectedExportCat, setSelectedExportCat] = useState("");

// FILTER EXPORT DATA
const getExportData = () => {

  let data = [...allArticles];

  // FILTER CATEGORY
  if (selectedExportCat !== "") {
    data = data.filter(
      (a) => a.ref_cat === selectedExportCat
    );
  }

  // FILTER DATE
  if (dateDebut && dateFin) {

    data = data.filter((a) => {

      const articleDate =
        new Date(a.temstape);

      const start =
        new Date(dateDebut);

      const end =
        new Date(dateFin);

      return articleDate >= start &&
             articleDate <= end;
    });
  }

  // FILTER SEARCH ARTICLE
  if (search !== "") {

    data = data.filter(
      (a) =>
        a.produit
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }

  return data;
};

// ================= EXPORT PDF =================

const exportPDF = () => {

  const doc = new jsPDF();

  const data = getExportData();

  doc.text(
    "Rapport des Articles",
    14,
    15
  );

  autoTable(doc, {

    startY: 25,

    head: [[
      "REF",
      "Code",
      "Categorie",
      "Produit",
      "Designation",
      "Quantite",
      "Etat",
      "Date"
    ]],

    body: data.map((a) => {

      const qty =
        Number(a.quantite ?? 0);

      return [

        a.ref_art,

        a.code_compta,

        a.nom_cat,

        a.produit,

        a.designation,

        qty,

        getStatus(qty).text,

        a.temstape
          ? new Date(a.temstape)
              .toLocaleString()
          : "-",
      ];
    }),
  });

  doc.save("rapport_articles.pdf");
};

// ================= EXPORT EXCEL =================

const exportExcel = () => {

  const data = getExportData();

  const excelData = data.map((a) => {

    const qty =
      Number(a.quantite ?? 0);

    return {

      REF: a.ref_art,

      CODE_COMPTA:
        a.code_compta,

      CATEGORIE:
        a.nom_cat,

      PRODUIT:
        a.produit,

      DESIGNATION:
        a.designation,

      QUANTITE: qty,

      ETAT:
        getStatus(qty).text,

      DATE:
        a.temstape
          ? new Date(a.temstape)
              .toLocaleString()
          : "-",
    };
  });

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Articles"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const dataFile = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    dataFile,
    "rapport_articles.xlsx"
  );
};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      <Navbar />

      <div className="max-w-7xl mx-auto p-3 md:p-6">

        {/* HEADER */}
        <div className="mt-20 text-sm mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-white">
            Gestion des Articles
          </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
            Liste des matériels Hospitalier
          </p>
        </div>

        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          {/* STATS */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-3">

            <div onClick={showAll}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Total</p>
              <h2 className="text-xl font-bold">{allArticles.length}</h2>
            </div>

         <div
  onClick={showDisponible}
  className={`rounded-xl shadow p-3 cursor-pointer
  ${activeFilter === "OK" ? "bg-green-200" : "bg-white dark:bg-gray-800"}`}
>
  <p className="text-xs text-gray-500">Disponible</p>
  <h2 className="text-xl font-bold text-green-600">
    {allArticles.filter(a => Number(a.quantite ?? a.stock ?? 0) >= 10).length}
  </h2>
</div>
            <div onClick={showFaible}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Faible</p>
              <h2 className="text-xl font-bold text-orange-500">
                {allArticles.filter(a =>
                  Number(a.quantite ?? a.stock ?? 0) > 0 &&
                  Number(a.quantite ?? a.stock ?? 0) < 10
                ).length}
              </h2>
            </div>

            <div onClick={showRupture}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Rupture</p>
              <h2 className="text-xl font-bold text-red-600">
                {allArticles.filter(a => Number(a.quantite ?? a.stock ?? 0) === 0).length}
              </h2>
            </div>

          </div>

          {/* FORM */}
          <div className="lg:w-1/2">

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3">

              <h2 className="text-base font-semibold mb-3 dark:text-white">
                Ajouter Article
              </h2>

              <form onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <select
                  value={formData.ref_cat}
                  onChange={handleCategoryChange}
                  className="p-2 rounded-lg border bg-transparent dark:text-white"
                  required
                >
                  <option value="">Catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.ref_cat} value={cat.ref_cat}>
                      {cat.nom}
                    </option>
                  ))}
                </select>

                <input
                  disabled
                  value={selectedCategory?.ref_cat || ""}
                  className="p-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:text-white"
                />

                <input
                  disabled
                  value={selectedCategory?.code_compta || ""}
                  className="p-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:text-white"
                />

                <input
                  name="produit"
                  value={formData.produit}
                  onChange={handleChange}
                  placeholder="Produit"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Désignation"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-2">
                  <FiPlus /> Ajouter
                </button>

              </form>

            </div>

          </div>

        </div>

 {/* TOP BAR: SEARCH + EXPORT */}
<div className="flex flex-col lg:flex-row gap-4 mb-6">

  {/* ================= SEARCH (GAUCHE) ================= */}
  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-3">

    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">

      <FiSearch />

      <input
        className="w-full bg-transparent outline-none dark:text-white"
        placeholder="Recherche..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

  </div>

  {/* ================= EXPORT (DROITE) ================= */}
  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
    <div className="flex flex-col md:flex-row gap-3">

      <select
        value={selectedExportCat}
        onChange={(e) =>
          setSelectedExportCat(e.target.value)
        }
        className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
      >
        <option value="">
          Toutes catégories
        </option>

        {categories.map((cat) => (
          <option
            key={cat.ref_cat}
            value={cat.ref_cat}
          >
            {cat.nom}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dateDebut}
        onChange={(e) =>
          setDateDebut(e.target.value)
        }
        className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
      />

      <input
        type="date"
        value={dateFin}
        onChange={(e) =>
          setDateFin(e.target.value)
        }
        className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
      />

      <div className="flex gap-2 flex-1">

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
        >
          PDF
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Excel
        </button>

      </div>

    </div>

  </div>

</div>
        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-blue-600 dark:bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">REF</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Code compta</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Catégorie</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Produit</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Quantité</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Etat</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Created At</th>
                </tr>
              </thead>

              <tbody>
                {filteredArticles.map(article => {

                  const qty = Number(article.quantite ?? article.stock ?? 0);
                  const status = getStatus(qty);

                  return (
                    <tr key={article.id}
                      className="border-b dark:border-gray-700">

                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{article.ref_art}</td>
                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{article.code_compta}</td>
                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{article.nom_cat}</td>
                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{article.produit}</td>
                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{article.designation}</td>
                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">{qty}</td>

                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded ${status.color}`}>
                          {status.text}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-dark-500 dark:text-gray-400">
                        {article.temstape
                          ? new Date(article.temstape).toLocaleString()
                          : "-"}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}