const Article = require("../models/articleModel");
const db = require("../db");
// Amboarina ny lalana mifanaraka amin'ny rakitra historique.js
const Historique = require("../models/historiqueModel");
// ================= GET ALL =================
exports.getArticles = async (req, res) => {
  try {
    const { rows } = await Article.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GET ARTICLES ERROR" });
  }
};

// ================= UPDATE STOCK =================
exports.updateStock = async (req, res) => {
  try {
    const id_article = req.params.id;
    const { quantite } = req.body; 

    // 1. Alaina ny stock teo aloha talohan'ny fanovana
    const { rows } = await Article.getAll();
    const currentArticle = rows.find(a => a.id === parseInt(id_article));

    if (!currentArticle) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    const stock_recent = parseInt(currentArticle.quantite) || 0; 
    const stock_actuel = parseInt(quantite); 
    const quantite_diff = stock_actuel - stock_recent; 

    // 2. Fanovàna ny stock
    await Article.updateStock(id_article, stock_actuel);

    // 3. Fampidirana ao amin'ny historique raha nisy fiovana ny sanda
    if (quantite_diff !== 0) {
      const type_mouvement = quantite_diff > 0 ? "ENTREE" : "SORTIE";
      
      await Historique.addHistorique({
        id_article: id_article,
        id_demande: null,
        type_mouvement: type_mouvement,
        stock_recent: stock_recent,
        quantite_mvmt: Math.abs(quantite_diff), 
        stock_actuel: stock_actuel
      });
    }

    res.json({ message: "Stock updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ================= ADD ARTICLE (Misy prefixes sy Historique) =================
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

    // Filtre par catégorie
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
    const formattedNumber = String(nextNumber).padStart(3, "0");

    // ================= FIXED REF =================
    const ref_art = `ART-${prefix}-${formattedNumber}`;

    // ================= INSERT IN ARTICLES =================
    await Article.insert({
      ref_art,
      ref_cat,
      code_compta,
      nom_cat,
      produit,
      designation,
      stock
    });

    // ================= INSERT IN HISTORIQUE =================
    const { rows: updatedRows } = await Article.getAll();
    const newArticle = updatedRows[0]; 
    
    if (newArticle) {
      await Historique.addHistorique({
        id_article: newArticle.id,
        id_demande: null,
        type_mouvement: "ENTREE",
        stock_recent: 0,
        quantite_mvmt: parseInt(stock) || 0,
        stock_actuel: parseInt(stock) || 0
      });
    }

    res.json({
      message: "Article ajouté",
      ref_art
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "INSERT ERROR" });
  }
};