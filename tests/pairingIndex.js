const fs = require("fs-extra");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("baileys");
const pino = require("pino");

async function startBot() {
    console.log("Starting bot...");
    fs.ensureDirSync("auths");

    const { state, saveCreds } = await useMultiFileAuthState("auths");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Nano-MD", "Chrome", "1.0.0"]
    });

    console.log("Created sock successfully!");

    // Save credentials
    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
        console.log("Requesting pairing code...")
        const phone = "2349167067495";
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phone, "TESTCODE");
            console.log(`Pairing Code: ${code}`);
        }, 5000);
    }

    sock.ev.on("connection.update", async (update) => {
        const { connection } = update;

        if (connection === "connecting") {
            console.log("Connecting to WhatsApp...");

        }

        if (connection === "open") {
            console.log("Connected successfully!");
        }
        // Request pairing code only when connection starts
    });
    
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        
        for (const m of messages) {
            if (!m) continue;
            
            const msg = m.message.conversation || m.message.extendedTextMessage.text;
            if (!msg) continue;
            if (!msg.startsWith("!")) continue;
            const jid = m.key.remoteJid;
            sock.sendMessage(jid, {text: "Hi there! I'm Nano-MD bot!"});
        }
    })
}

startBot();
process.stdin.resume();