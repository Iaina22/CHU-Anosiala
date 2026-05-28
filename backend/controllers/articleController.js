const Article = require("../models/articleModel");
const db = require("../db");
// GET ALL
exports.getArticles = async (req, res) => {
  try {
    const { rows } = await Article.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GET ARTICLES ERROR" });
  }
};

// ADD ARTICLE
exports.addArticle = async (req, res) => {
  try {
    const {
      ref_cat,
      code_compta,
      produit,
      designation,
      stock,
      nom_cat
    } = req.body;

    const ref_art = "ART-" + Date.now();

    await Article.insert({
      ref_art,
      ref_cat,
      code_compta,
      nom_cat,
      produit,
      designation,
      stock
    });

    res.json({ message: "Article ajouté" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "INSERT ERROR" });
  }
};

// UPDATE STOCK
exports.updateStock = async (req, res) => {
  try {
    const { quantite } = req.body;

    await Article.updateStock(req.params.id, quantite);

    res.json({ message: "Stock updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.addArticle = async (req, res) => {

  try {

    const {
      ref_cat,
      code_compta,
      produit,
      designation,
      stock,
      nom_cat
    } = req.body;

    // ================= PREFIX =================
    const prefixes = {
      MED: "MED",
      INF: "INF",
      MOB: "MOB",
      LAB: "LAB",
      URG: "URG",
      CONS: "CONS",
      PHM: "PHM",
      ENT: "ENT",
      TEC: "TEC",
      LOG: "LOG",
    };

    const prefix = prefixes[ref_cat] || "GEN";

    // ================= GET ALL =================
    const { rows } = await Article.getAll();

    // filtre par catégorie
    const sameCat = rows.filter(
      (a) => a.ref_cat === ref_cat && a.ref_art
    );

    // ================= FIND LAST NUMBER =================
    let lastNumber = 0;

    sameCat.forEach((a) => {

      const parts = a.ref_art.split("-");

      const num = parseInt(parts[2]);

      if (!isNaN(num) && num > lastNumber) {
        lastNumber = num;
      }

    });

    // ================= NEXT NUMBER =================
    const nextNumber = lastNumber + 1;

    const formattedNumber =
      String(nextNumber).padStart(3, "0");

    // ================= FIXED REF =================
    const ref_art =
      `ART-${prefix}-${formattedNumber}`;

    // ================= INSERT =================
    await Article.insert({
      ref_art,
      ref_cat,
      code_compta,
      nom_cat,
      produit,
      designation,
      stock
    });

    res.json({
      message: "Article ajouté",
      ref_art
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "INSERT ERROR" });
  }
};