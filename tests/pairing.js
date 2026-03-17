// tests/pairing.js
/*
 * WhatsApp Pairing Code Test Script
 * Fully fixed version for Baileys
 * - Correct browser array
 * - Async/await for requestPairingCode
 * - Single-shot pairing request
 * - Debug logging
 */

require("dotenv").config();
const fs = require("fs-extra");
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("baileys");

async function startBot() {
    console.log("🚀 Starting pairing bot...");

    // Ensure auth folder exists
    fs.ensureDirSync("./auths");

    // Load/save auth state
    const { state, saveCreds } = await useMultiFileAuthState("./auths");

    // Get latest Baileys version
    const { version } = await fetchLatestBaileysVersion();

    // Create socket
    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "debug" }),
        browser: ["Mac OS", "Chrome", "1.0.0"], // ✅ correct array format
        printQRInTerminal: false
    });

    console.log("✅ Socket created!");

    // Automatically save credentials
    sock.ev.on("creds.update", saveCreds);

    // Pairing flag to prevent multiple requests
    let pairingRequested = false;

    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update;
        const phone = process.env.PHONE_NUMBER;

        if ((connection === "connecting" || !!qr) && !pairingRequested) {
            pairingRequested = true;

            try {
                if (!phone) throw new Error("PHONE_NUMBER missing in .env");

                console.log("📲 Requesting pairing code...");

                // Small delay to ensure socket is ready
                await new Promise(res => setTimeout(res, 3000));

                // ✅ Await the Promise so we get the actual code
                const code = await sock.requestPairingCode(phone);

                console.log(`\n🔑 Pairing Code: ${code}\n`);
                console.log("⚠️ DO NOT stop the process. Enter code on WhatsApp immediately.");

            } catch (err) {
                console.error("❌ Pairing error:", err);
            }
        }

        if (connection === "open") {
            console.log("✅ SUCCESS: Bot linked!");
        }

        if (connection === "close") {
            console.log("❌ Connection closed.");
        }
    });

    // Keep process alive
    process.stdin.resume();
}

// Start the bot
startBot();