
const { createSock } = require("./socket/index.js");
const { handleEvents } = require("./socket/events.js");
const express = require("express");
const db = require("./database");
const fs = require("fs-extra")
const { dataDir } = require("../config/paths.js");
require("dotenv").config();

async function startExpressServer () {
    const app = express();
    app.use(express.json());
    
    // Health check route
    app.get("/", (req, res) => {
        res.json({
            status: "alive",
            message: "SUPER GENE backend is breathing"
        });
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Server running on port 3000");
    });
}

async function startBot () {
    await fs.ensureDir(dataDir);
    await db.init();
    
    const args = process.argv;
    const mode = args[2];
    
    const sock = await createSock(mode);
    await handleEvents(sock, {
        pairCodeLogin: false,
        phoneNumber: process.env.PHONE,
        reconnect: startBot,
        mode: mode
    });
}

startExpressServer();
startBot();
process.stdin.resume();