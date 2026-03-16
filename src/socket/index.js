// src/sock/index.js

const fs = require("fs-extra");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers
} = require("baileys");
const pino = require("pino");

async function createSock () {
    console.log("Starting bot...");
    await fs.ensureDir("auth");
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();
    console.log("Running baileys version:", version);
    
    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({level: "silent"}),
        // browser: Browsers.macOS("Google Chrome"),
        browser: ["Nano-MD", "Chrome", "1.0"],
        printQRInTerminal: false,
        markOnlineOnConnect: true
        
    });
    console.log("Created sock successfully!");
    
    sock.ev.on("creds.update", saveCreds);
    
    return sock;
}

module.exports = { createSock };