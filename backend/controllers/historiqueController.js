const Historique = require("../models/historiqueModel");

// Sintonina ny tantara rehetra misy antsipiriany
exports.getHistoriqueList = async (req, res) => {
  try {
    const data = await Historique.getAllWithDetails();
    return res.status(200).json({
      success: true,
      message: "Tantara azo soa aman-tsara",
      data: data
    });
  } catch (error) {
    console.error("Error ao amin'ny historiqueController:", error);
    return res.status(500).json({
      success: false,
      message: "Nisy olana teo am-pakana ny tantara",
      error: error.message
    });
  }
};