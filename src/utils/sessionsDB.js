const fs = require("fs-extra");
const path = require("path");
const db = require("../database");

const SESSION_ID = 1;

async function saveSessionToDB(sessionPath) {
    const files = await fs.readdir(sessionPath);
    const sessionData = {};

    for (const file of files) {
        const fullPath = path.join(sessionPath, file);
        const content = await fs.readFile(fullPath, "utf-8");
        sessionData[file] = content;
    }

    db.run(
        `INSERT OR REPLACE INTO session (id, data) VALUES (?, ?)`,
        [SESSION_ID, JSON.stringify(sessionData)]
    );

    console.log("✅ Session saved to DB");
}

async function loadSessionFromDB(sessionPath) {
    const row = db.get(`SELECT data FROM session WHERE id = ?`, [SESSION_ID]);

    if (!row) {
        console.log("⚠️ No session in DB");
        return false;
    }

    const sessionData = JSON.parse(row.data);

    await fs.ensureDir(sessionPath);

    for (const file in sessionData) {
        const fullPath = path.join(sessionPath, file);
        await fs.writeFile(fullPath, sessionData[file]);
    }

    console.log("✅ Session restored from DB");
    return true;
}

function clearSessionDB() {
    db.run(`DELETE FROM session WHERE id = ?`, [SESSION_ID]);
    console.log("🗑️ Session cleared from DB");
}

module.exports = {
    saveSessionToDB,
    loadSessionFromDB,
    clearSessionDB
};
