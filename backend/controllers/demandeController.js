const pool = require("../db");

// GET demandes par user
exports.getDemandesByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID manquant" });
    }

    const result = await pool.query(
      "SELECT * FROM ref.demandes WHERE id_user = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Erreur getDemandesByUser:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// POST nouvelle demande
exports.addDemande = async (req, res) => {
  try {

    const {
      id_user,
      prenom,
      role,
      categorie,
      produit,
      quantiter,
      designation,
      status,
      demande_group
    } = req.body;

    await pool.query(
      `INSERT INTO ref.demandes
      (id_user, prenom, role, categorie, produit, quantiter, designation, status, demande_group)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id_user,
        prenom,
        role,
        categorie,
        produit,
        quantiter,
        designation,
        status || "en attente",
        demande_group || null
      ]
    );

    res.json({ message: "Demande ajoutée" });

  } catch (err) {
    console.error("Erreur addDemande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// GET ALL DEMANDES (ADMIN)
exports.getAllDemandes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ref.demandes ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// UPDATE STATUS DEMANDE
exports.updateDemandeStatus = async (req, res) => {
  try {

    const { status } = req.body;
    const { id } = req.params;

    await pool.query(
      `
      UPDATE ref.demandes
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    res.json({
      success: true,
      message: "Status updated",
    });

  } catch (err) {

    console.error("UPDATE STATUS ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};