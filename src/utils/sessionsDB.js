const fs = require("fs-extra");
const path = require("path");
const db = require("../database");

const SESSION_ID = "wa_session";

async function saveSessionToDB(sessionPath) {
    const files = await fs.readdir(sessionPath);
    const sessionData = {};

    for (const file of files) {
        const fullPath = path.join(sessionPath, file);

        // read as BUFFER (IMPORTANT for auth files)
        const content = await fs.readFile(fullPath);

        // store base64 instead of utf-8
        sessionData[file] = content.toString("base64");
    }

    db.db.run(
        `INSERT OR REPLACE INTO session (id, data) VALUES (?, ?)`,
        [SESSION_ID, JSON.stringify(sessionData)]
    );

    db.save(); // persist to file

    console.log("✅ Session saved to DB (base64)");
}

async function loadSessionFromDB(sessionPath) {
    const res = db.db.exec(
        `SELECT data FROM session WHERE id='${SESSION_ID}'`
    );

    if (!res.length) {
        console.log("⚠️ No session in DB");
        return false;
    }

    const sessionData = JSON.parse(res[0].values[0][0]);

    await fs.ensureDir(sessionPath);

    for (const file in sessionData) {
        const fullPath = path.join(sessionPath, file);

        // decode base64 back to buffer
        const buffer = Buffer.from(sessionData[file], "base64");

        await fs.writeFile(fullPath, buffer);
    }

    console.log("✅ Session restored from DB");
    return true;
}

function clearSessionDB() {
    db.db.run(`DELETE FROM session WHERE id='${SESSION_ID}'`);
    db.save();

    console.log("🗑️ Session cleared from DB");
}

module.exports = {
    saveSessionToDB,
    loadSessionFromDB,
    clearSessionDB
};