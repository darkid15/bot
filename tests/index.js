const fs = require("fs-extra");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    delay
} = require("baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");

async function startBot() {
    console.log("🚀 Nano-MD: Final Stand Initialization...");
    fs.ensureDirSync("auths");

    const { state, saveCreds } = await useMultiFileAuthState("auths");

    const sock = makeWASocket({
        // Hardcoding a high version often fixes 405 errors
        version: [2, 3000, 1015901307], 
        auth: state,
        logger: pino({ level: "silent" }),
        // This specific browser string is most stable for pairing codes
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false,
        connectTimeoutMs: 60000, // Increase timeout to 60s
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000
    });

    // --- PAIRING CODE LOGIC ---
    if (!sock.authState.creds.registered) {
        const phone = "2349167067495";
        console.log(`📲 Target Phone: ${phone}`);
        
        // We wait for the 'connecting' state to stabilize
        setTimeout(async () => {
            try {
                console.log("📡 Requesting Pairing Code from Server...");
                let code = await sock.requestPairingCode(phone);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n💎 YOUR CODE: ${code} 💎\n`);
            } catch (err) {
                console.error("❌ Pairing Request Failed. Error:", err.message);
            }
        }, 10000); // 10 second delay to ensure socket is ready
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "connecting") console.log("⏳ Handshaking with WhatsApp...");

        if (connection === "open") {
            console.log("✅ SUCCESS! Nano-MD is Online.");
        }

        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(`⚠️ Connection Failed (Code: ${reason}).`);
            
            // If it's a timeout (408) or 405, we wait and retry
            if (reason !== DisconnectReason.loggedOut) {
                console.log("🔄 Retrying in 5 seconds...");
                setTimeout(() => startBot(), 5000);
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        const m = messages[0];
        if (!m.message) return;
        const msgText = m.message.conversation || m.message.extendedTextMessage?.text || "";
        if (msgText.startsWith("!ping")) {
            await sock.sendMessage(m.key.remoteJid, { text: "Pong! I am alive!" });
        }
    });
}

startBot();
