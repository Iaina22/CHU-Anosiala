import React, { useEffect, useState } from "react";

import Navbar from "../../components/NavbarUser";

import { getArticles } from "../../services/articleService";

import {
  FiSearch,
  FiPackage,
  FiBox,
} from "react-icons/fi";

export default function Article() {

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

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

  // ================= GROUP CATEGORY =================

  const groupedArticles = articles.reduce((acc, article) => {

    const category =
      article.nom_cat || "Sans catégorie";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(article);

    return acc;

  }, {});

  // ================= SEARCH =================

  const filteredCategories = Object.keys(
    groupedArticles
  ).filter((category) => {

    const categoryArticles =
      groupedArticles[category];

    return categoryArticles.some((article) =>

      article.produit?.toLowerCase().includes(search.toLowerCase()) ||
      article.designation?.toLowerCase().includes(search.toLowerCase()) ||
      article.code_compta?.toLowerCase().includes(search.toLowerCase()) ||
      article.ref_art?.toLowerCase().includes(search.toLowerCase())

    );
  });

  return (

  <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

    <Navbar />

    <div className="max-w-7xl mx-auto mt-5 p-2 sm:p-3 md:p-4">

      {/* HEADER */}
      <div className="mt-16 mb-4 text-center md:text-left">

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-white">
          Articles
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1">
          Matériels disponibles
        </p>

      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 mb-4">

        <div className="flex items-center gap-2 border dark:border-gray-700 rounded-lg px-2 py-2">

          <FiSearch className="text-gray-500 text-sm" />

          <input
            type="text"
            placeholder="Recherche..."
            className="w-full bg-transparent outline-none text-sm dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* EMPTY */}
      {filteredCategories.length === 0 && (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">

          <FiPackage className="mx-auto text-3xl text-gray-400 mb-2" />

          <h2 className="text-sm sm:text-base font-bold dark:text-white">
            Aucun article trouvé
          </h2>

        </div>

      )}

      {/* CATEGORY LIST */}
      <div className="space-y-4">

        {filteredCategories.map((category) => {

          const categoryArticles = groupedArticles[category];

          return (

            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
            >

              {/* CATEGORY HEADER */}
              <div className="bg-blue-500 text-white px-3 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">

                <div>

                  <h2 className="text-sm sm:text-base md:text-lg font-bold">
                    {category}
                  </h2>

                  <p className="text-xs text-blue-100">
                    {categoryArticles.length} article(s)
                  </p>

                </div>

                <FiBox className="text-base sm:text-lg" />

              </div>

              {/* ARTICLES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 sm:p-3">

                {categoryArticles
                  .filter((article) =>
                    article.produit?.toLowerCase().includes(search.toLowerCase()) ||
                    article.designation?.toLowerCase().includes(search.toLowerCase()) ||
                    article.code_compta?.toLowerCase().includes(search.toLowerCase()) ||
                    article.ref_art?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((article) => (

                    <div
                      key={article.id}
                      className="border dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition"
                    >

                      {/* TITLE */}
                      <h3 className="font-semibold text-sm text-green-600 dark:text-white">
                        {article.produit}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                        {article.designation}
                      </p>

                      {/* INFOS */}
                      <div className="text-xs space-y-1">

                        <div className="flex justify-between">
                          <span className="text-gray-500">Ref</span>
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

          );

        })}

      </div>

    </div>

  </div>
);
}