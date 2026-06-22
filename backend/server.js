const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const articleRoutes = require("./routes/articleRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const demandeRoutes = require("./routes/demandeRoutes");
const historiqueRoutes = require("./routes/historiqueRoutes");



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// 🔥 MAP USER → SOCKET
const usersSocket = {};

io.on("connection", (socket) => {
  console.log("Client connecté:", socket.id);

  // 🔐 REGISTER USER
  socket.on("registerUser", (userId) => {
    if (!userId) return;

    socket.userId = userId;

    usersSocket[userId] = socket.id;

    console.log("User enregistré socket:", userId, socket.id);
  });

  // ❌ DISCONNECT CLEAN
  socket.on("disconnect", () => {
    if (socket.userId) {
      delete usersSocket[socket.userId];
      console.log("User déconnecté:", socket.userId);
    }
  });
});

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/demandes", demandeRoutes);
app.use("/api/historique", historiqueRoutes);
app.put("/api/articles/:id", async (req, res) => {

  const { id } = req.params;
  const { stock } = req.body;

  try {

    await db.query(
      `
      UPDATE articles
      SET
        stock = $1,
        created_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [stock, id]
    );

    res.json({
      message: "Article updated",
    });

  } catch (error) {

    console.log("UPDATE ERROR :", error);

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });

  }

});
// ======================
// INSCRIPTION
// ======================
app.post('/api/register', async (req, res) => {
  const { nom, prenom, age, sexe, cin, adresse, email, phone, role, mdp } = req.body;

  if (!nom || !prenom || !email || !mdp) {
    return res.status(400).json({
      success: false,
      message: 'Champs requis manquants'
    });
  }

  try {
    const emailCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    const hashedPassword = await bcrypt.hash(mdp, 10);

    const result = await db.query(`
      INSERT INTO users 
      (nom, prenom, age, sexe, cin, adresse, email, phone, role, password_hash, status)
      VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
      RETURNING id
    `, [
      nom, prenom, age, sexe, cin, adresse, email, phone, role, hashedPassword
    ]);

   io.emit("newUser", {
  message: `${prenom} envoie une demande`
});

    res.json({
      success: true,
      message: "Inscription réussie",
      userId: result.rows[0].id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// ======================
// LOGIN
// ======================
app.post('/api/login', async (req, res) => {
  const { prenom, mdp } = req.body;

  try {
    const userQuery = await db.query(
      'SELECT * FROM users WHERE prenom = $1',
      [prenom]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(mdp, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mot de passe incorrect"
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        status: user.status
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});


// ======================
// ADMIN - PENDING USERS
// ======================
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nom, prenom, age, sexe, cin, adresse, email, phone, role
      FROM users
      WHERE status = 'pending'
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nom, prenom, age, sexe, cin, adresse, email, phone, role, status
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});


// ======================
// APPROVE USER
// ======================
app.post('/api/admin/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE users SET status='active' WHERE id=$1",
      [id]
    );

    const socketId = usersSocket[id];

    console.log("APPROVE USER:", id, socketId);

    if (socketId) {
      io.to(socketId).emit("approved", {
        message: "✅ Votre compte est approuvé"
      });
    }

    res.json({
      success: true,
      message: "Utilisateur approuvé"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});


// ======================
// REJECT USER
// ======================
app.post('/api/admin/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE users SET status='rejected' WHERE id=$1",
      [id]
    );

    const socketId = usersSocket[id];

    console.log("REJECT USER:", id, socketId);

    if (socketId) {
      io.to(socketId).emit("rejected", {
        message: "❌ Votre demande a été refusée"
      });
    }

    res.json({
      success: true,
      message: "Utilisateur refusé"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});
//profil
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT id, nom, prenom, age, sexe, email,cin,adresse, phone, role, status FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ======================
// START SERVER
// ======================
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.io running on port ${PORT}`);
});