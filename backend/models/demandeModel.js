const db = require("../db");

// ================= ADD =================
exports.addDemande = async (data) => {

  const result = await db.query(
    `
    INSERT INTO ref.demandes
    (
      id_user,
      prenom,
      role,
      categorie,
      produit,
      quantiter,
      designation,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      data.id_user,
      data.prenom,
      data.role,
      data.categorie,
      data.produit,
      data.quantiter,
      data.designation,
      data.status
    ]
  );

  // === AJOUT DE L'OPTION NOTIFICATION ===
  const nouvelleDemande = result.rows[0];
  const messageNotification = `${nouvelleDemande.prenom || 'Un utilisateur'} a envoyé une demande pour le produit : ${nouvelleDemande.produit}`;
  
  await db.query(
    `INSERT INTO ref.notifications (demande_id, message) VALUES ($1, $2)`,
    [nouvelleDemande.id, messageNotification]
  );
  // ======================================

  return nouvelleDemande;
};

// ================= USER DEMANDES =================
exports.getByUser = async (id_user) => {

  const result = await db.query(
    `
    SELECT *
    FROM ref.demandes
    WHERE id_user = $1
    ORDER BY id DESC
    `,
    [id_user]
  );

  return result.rows;
};

// ================= GET ALL =================
exports.getAll = async () => {

  const result = await db.query(
    `
    SELECT *
    FROM ref.demandes
    ORDER BY id DESC
    `
  );

  return result.rows;
};

// === NOUVELLE FONCTION REQUÊTE POUR LA NAVBAR ===
// Namboarina mba tsy hamerina afa-tsy ny mbola tsy vakiana (is_read = false)
exports.getNotificationsData = async () => {
  const listeNotif = await db.query(
    "SELECT * FROM ref.notifications WHERE is_read = false ORDER BY created_at DESC"
  );
  
  const totalNonLus = await db.query(
    "SELECT COUNT(*) FROM ref.notifications WHERE is_read = false"
  );

  return {
    notifications: listeNotif.rows,
    count: parseInt(totalNonLus.rows[0].count, 10)
  };
};

// ================= MARQUER TOUT COMME LU =================
exports.markAllAsRead = async () => {
  const result = await db.query(
    `UPDATE ref.notifications SET is_read = true WHERE is_read = false`
  );
  return result;
};