const db = require("../db");

// CREATE USER
const createUser = async (userData) => {
  const {
    nom,
    prenom,
    age,
    sexe,
    cin,
    adresse,
    email,
    phone,
    role,
    password_hash,
    status
  } = userData;

  return await db.query(
    `INSERT INTO users
    (nom, prenom, age, sexe, cin, adresse, email, phone, role, password_hash, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      nom,
      prenom,
      age,
      sexe,
      cin,
      adresse,
      email,
      phone,
      role,
      password_hash,
      status
    ]
  );
};

// CHECK REF PERSONNEL
const checkRefPersonnel = async (nom, prenom, cin) => {
  return await db.query(
    `SELECT *
     FROM ref.personel
     WHERE nom = $1
     AND prenom = $2
     AND cin = $3`,
    [nom, prenom, cin]
  );
};

// LOGIN
const getUserByPrenom = async (prenom) => {
  return await db.query(
    "SELECT * FROM users WHERE prenom = $1",
    [prenom]
  );
};

// GET USER BY ID
const getUserById = async (id) => {
  return await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
};

// UPDATE USER
const updateUserById = async (id, userData) => {
  const {
    nom,
    prenom,
    age,
    sexe,
    adresse,
    email,
    phone,
    cin
  } = userData;

  return await db.query(
    `UPDATE users
     SET nom=$1,
         prenom=$2,
         age=$3,
         sexe=$4,
         adresse=$5,
         email=$6,
         phone=$7,
         cin=$8
     WHERE id=$9
     RETURNING *`,
    [nom, prenom, age, sexe, adresse, email, phone, cin, id]
  );
};

module.exports = {
  createUser,
  checkRefPersonnel,
  getUserByPrenom,
  getUserById,
  updateUserById
};