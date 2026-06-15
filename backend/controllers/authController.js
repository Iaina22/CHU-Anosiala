const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { nom, prenom, age, sexe, cin, adresse, email, phone, role, mdp } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Vérification dans ref.personel
    const refCheck = await userModel.checkRefPersonnel(
      nom,
      prenom,
      cin
    );

    // Détermination du status
    const status =
      refCheck.rows.length > 0 ? "active" : "pending";

    // Création utilisateur
    const result = await userModel.createUser({
      nom,
      prenom,
      age,
      sexe,
      cin,
      adresse,
      email,
      phone,
      role,
      password_hash: hashedPassword,
      status
    });

    return res.status(200).json({
      success: true,
      message:
        status === "active"
          ? "Compte validé automatiquement"
          : "Compte en attente de validation",
      userId: result.rows[0].id,
      status
    });

  } catch (err) {
    console.error("REGISTER ERROR FULL:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// ================= LOGIN =================
exports.login = async (req, res) => {
  const { prenom, mdp } = req.body;

  try {
    const userQuery = await userModel.getUserByPrenom(prenom);

    if (userQuery.rows.length === 0) {
      return res.json({
        success: false,
        message: "Compte inexistant"
      });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(mdp, user.password_hash);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Mot de passe incorrect"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

// ================= GET USER BY ID =================
exports.getUser = async (req, res) => {
  try {
    const userQuery = await userModel.getUserById(req.params.id);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userQuery.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ================= UPDATE USER =================
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.updateUserById(req.params.id, req.body);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
