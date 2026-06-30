const { google } = require('googleapis');
const path = require('path');

// Configuration de l'authentification avec le fichier JSON
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'), 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ID de votre feuille Google Sheet extrait de votre lien
const SPREADSHEET_ID = '18AFw-4GTTycXwQLQnePpJYiuZTHWFF24g7pZ4lS8zuE';

/**
 * Ajoute une nouvelle ligne dans la feuille Google Sheet
 * @param {Array} data - Données à insérer, ex: ['Désignation', 'Quantité', 'Statut']
 */
async function appendToSheet(data) {
    try {
        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: 'v4', auth: client });

        await googleSheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Feuille1!A:C', 
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [data], 
            },
        });
        console.log("✅ Données insérées avec succès dans Google Sheets");
    } catch (error) {
        console.error("❌ Erreur Google Sheets API:", error);
        throw error;
    }
}

module.exports = { appendToSheet };