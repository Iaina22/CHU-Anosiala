import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/NavbarUser";
import { getArticles } from "../../services/articleService";
import { FiSearch, FiPackage } from "react-icons/fi";

export default function Article() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();

      const dispo = data.filter(
        (a) => Number(a.quantite ?? a.stock ?? 0) > 0
      );

      setArticles(dispo);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CATEGORIES =================
  const categories = useMemo(() => {
    const cats = articles.map((a) => a.nom_cat || "Sans catégorie");
    return ["ALL", ...new Set(cats)];
  }, [articles]);

  // ================= FILTERED ARTICLES =================
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCategory =
        selectedCategory === "ALL" ||
        (a.nom_cat || "Sans catégorie") === selectedCategory;

      const text = search.toLowerCase();

      const matchSearch =
        a.produit?.toLowerCase().includes(text) ||
        a.designation?.toLowerCase().includes(text) ||
        a.ref_art?.toLowerCase().includes(text) ||
        a.code_compta?.toLowerCase().includes(text);

      return matchCategory && matchSearch;
    });
  }, [articles, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-16 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* ========== SIDEBAR CATEGORY ========== */}
        <div className="bg-white dark:bg-gray-800 mt-6 rounded-xl shadow p-3 h-fit">
          <h2 className=" font-bold text-[#0f5ed7] dark:text-cyan-300 mb-2">
            Catégories
          </h2>

          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="lg:col-span-3 ">

          {/* HEADER */}
          <div className="mb-3 mt-5">
            <h1 className="text-xl font-bold text-blue-600 dark:text-white">
              Articles
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Liste des articles disponibles
            </p>
          </div>

          {/* SEARCH */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 mb-4 flex items-center gap-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm dark:text-white"
            />
          </div>

          {/* EMPTY */}
          {filteredArticles.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
              <FiPackage className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-300">
                Aucun article trouvé
              </p>
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-3 border dark:border-gray-700"
              >
                {/* TITLE */}
                <h3 className="text-sm font-bold text-green-600 dark:text-white">
                  {article.produit}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                  {article.designation}
                </p>

                {/* INFO */}
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Réf</span>
                    <span className="font-semibold dark:text-white">
                      {article.ref_art}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Compta</span>
                    <span className="font-semibold text-blue-600">
                      {article.code_compta}
                    </span>
                  </div>

                 
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}