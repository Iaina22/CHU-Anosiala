const pool = require("../db");
const Historique = require("../models/historiqueModel");
const Article = require("../models/articleModel");

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


// POST nouvelle demande + AJOUT NOTIFICATION AUTOMATIQUE
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

    // 1. Insertion de la demande avec récupération de l'ID généré via 'RETURNING id'
    const nouvelleDemande = await pool.query(
      `INSERT INTO ref.demandes
      (id_user, prenom, role, categorie, produit, quantiter, designation, status, demande_group)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
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

    const demandeId = nouvelleDemande.rows[0].id;

    // 2. Création du message personnalisé (Ex: "Mimi a envoyé une demande de [produit]")
    const messageNotification = `${prenom || 'Un utilisateur'} a envoyé une demande pour le produit : ${produit}`;

    // 3. Insertion de la notification liée à la demande dans ref.notifications
    await pool.query(
      `INSERT INTO ref.notifications (demande_id, message) VALUES ($1, $2)`,
      [demandeId, messageNotification]
    );

    res.json({ message: "Demande ajoutée et notification créée" });

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


// ================= UPDATE STATUS + STOCK =================
exports.updateDemandeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // ================= 1. GET DEMANDE =================
    const demandeRes = await pool.query(
      `SELECT * FROM ref.demandes WHERE id = $1`,
      [id]
    );

    if (demandeRes.rows.length === 0) {
      return res.status(404).json({ message: "Demande introuvable" });
    }

    const demande = demandeRes.rows[0];

    // ================= 2. UPDATE SIMPLE SI PAS VALIDÉ =================
    if (status.toLowerCase() !== "valide") {
      await pool.query(
        `UPDATE ref.demandes SET status = $1 WHERE id = $2`,
        [status, id]
      );

      return res.json({ message: "Status updated" });
    }

    // ================= 3. GET ARTICLE (SAFE MATCH) =================
    const articleRes = await pool.query(
      `SELECT * FROM ref.articles WHERE LOWER(produit) = LOWER($1)`,
      [demande.produit]
    );

    if (articleRes.rows.length === 0) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    const article = articleRes.rows[0];

    // ================= 4. CHECK STOCK =================
    const quantiteDemande = Number(demande.quantiter);
    const stockActuel = Number(article.quantite);

    if (stockActuel < quantiteDemande) {
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    // ================= 5. UPDATE STOCK =================
    await pool.query(
      `UPDATE ref.articles
       SET quantite = quantite - $1
       WHERE id = $2`,
      [quantiteDemande, article.id]
    );

    // ================= 6. INSERT HISTORIQUE (NOMBOARINA ETO) =================
    const stockRecent = stockActuel;               // Ny stock teo aloha talohan'ny fampihenana
    const stockFin = stockActuel - quantiteDemande; // Ny sanda sisa tavela ao amin'ny stock

    await pool.query(
      `INSERT INTO ref.historique 
      (id_article, id_demande, type_mouvement, stock_recent, quantite_mvmt, stock_actuel)
      VALUES ($1, $2, 'SORTIE', $3, $4, $5)`,
      [
        article.id, 
        demande.id, 
        stockRecent, 
        quantiteDemande, 
        stockFin
      ]
    );

    // ================= 7. UPDATE DEMANDE =================
    await pool.query(
      `UPDATE ref.demandes SET status = 'validé' WHERE id = $1`,
      [id]
    );

    res.json({
      message: "Demande validée + stock mis à jour"
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "SERVER ERROR" });
  }
};


// ================= NOVELLE FONCTION: GET NOTIFICATIONS (POUR LA NAVBAR) =================
exports.getNotifications = async (req, res) => {
  try {
    // Récupère l'intégralité des notifications (sans limite de quantité) de la plus récente à la plus ancienne
    const listeNotif = await pool.query(
      "SELECT * FROM ref.notifications ORDER BY created_at DESC"
    );

    // Compte uniquement les messages qui ne sont pas encore lus (is_read = false)
    const totalNonLus = await pool.query(
      "SELECT COUNT(*) FROM ref.notifications WHERE is_read = false"
    );

    res.json({
      notifications: listeNotif.rows,
      count: parseInt(totalNonLus.rows[0].count, 10)
    });
  } catch (error) {
    console.error("Erreur getNotifications:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    await require("../models/demandeModel").markAllAsRead();
    res.json({ success: true, message: "Notifications marquées comme lues" });
  } catch (err) {
    console.error("Erreur markNotificationsAsRead:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

