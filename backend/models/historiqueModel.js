const db = require("../db");

// ================= HAMPIDITRA HISTORIQUE =================
exports.addHistorique = async (data) => {
  const result = await db.query(
    `
    INSERT INTO ref.historique 
    (id_article, id_demande, type_mouvement, stock_recent, quantite_mvmt, stock_actuel)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      data.id_article,
      data.id_demande || null, 
      data.type_mouvement,     // 'ENTREE' na 'SORTIE'
      data.stock_recent,
      data.quantite_mvmt,
      data.stock_actuel
    ]
  );
  return result.rows[0];
};

// ================= RETY NY HISTORIQUE REHETRA (Mifandray ny 3 Tables) =================
exports.getAllWithDetails = async () => {
  const result = await db.query(
    `
    SELECT 
      h.id,
      h.type_mouvement,
      h.stock_recent,
      h.quantite_mvmt,
      h.stock_actuel,
      h.timestamp,
      a.produit,
      a.designation,
      d.prenom as demandeur
    FROM ref.historique h
    LEFT JOIN ref.articles a ON h.id_article = a.id
    LEFT JOIN ref.demandes d ON h.id_demande = d.id
    ORDER BY h.id DESC
    `
  );
  return result.rows;
};