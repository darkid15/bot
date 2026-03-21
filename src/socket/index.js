// src/sock/index.js

const fs = require("fs-extra");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers
} = require("baileys");
const pino = require("pino");
const { saveSessionToDB, loadSessionFromDB } = require("../utils/sessionDB");

async function createSock(mode) {
    console.log("Starting bot...");

    const auth = "auth";

    if (mode === "prod") {
        await fs.remove(auth);
        await loadSessionFromDB(auth);
    }

    await fs.ensureDir(auth);

    const { state, saveCreds } = await useMultiFileAuthState(auth);
    const { version } = await fetchLatestBaileysVersion();

    console.log("Running baileys version:", version);

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Nano-MD", "Chrome", "1.0"],
        printQRInTerminal: false,
        markOnlineOnConnect: true
    });

    let saveTimeout;

    sock.ev.on("creds.update", async () => {
        await saveCreds();

        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(async () => {
            await saveSessionToDB(auth);
        }, 1000);
    });

    console.log("Created sock successfully!");

    return sock;
}
