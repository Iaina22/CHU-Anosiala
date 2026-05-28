const db = require("../db");

// GET ALL
exports.getAll = async () => {
  return await db.query(`
    SELECT * FROM ref.articles
    ORDER BY id DESC
  `);
};

// INSERT
exports.insert = async (data) => {

  return await db.query(
    `
    INSERT INTO ref.articles
    (
      ref_art,
      ref_cat,
      code_compta,
      nom_cat,
      produit,
      designation,
      quantite,
      temstape
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
    `,
    [
      data.ref_art,
      data.ref_cat,
      data.code_compta,
      data.nom_cat,
      data.produit,
      data.designation,
      data.stock
    ]
  );
};

// UPDATE STOCK
exports.updateStock = async (id, quantite) => {
  return await db.query(
    `
    UPDATE ref.articles
    SET quantite = $1
    WHERE id = $2
    `,
    [quantite, id]
  );
};