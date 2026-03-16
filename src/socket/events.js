const qrcode = require("qrcode-terminal");
const handleMessage = require("../handler/msgHandler.js");

async function handleEvents (sock, options={}) {
    const { pairCodeLogin, phonenumber, reconnect } = options;
    let qrRequested = false;
    let pairCodeRequested = false;
    
    sock.ev.on("connection.update", async (update) => {
        console.log("Checking connection updates...")
        const { connection, lastDisconnect, qr } = update;
        
        if ((connection === "connecting" || qr) && pairCodeLogin && !pairCodeRequested) {
            try {
                let code;
                pairCodeRequested = true;
                qrRequested = true;
                console.log("Requesting pairing code...");
                code = await sock.requestPairingCode(phonenumber);
                console.log(`\nPairing Code: ${code}\nType this in linked devices to login the bot.\n`);
            } catch (err) {
                console.log("Error requesting pairing code", err.stack || err);
                qrRequested = false;
            }
        }
        
        if (qr && !qrRequested) {
            qrRequested = true;
            console.log("Scan this qr to connect the bot:");
            qrcode.generate(qr, { small: true });
        };
        
        if (connection === "connecting") console.log("Connecting...");
        if (connection === "open") console.log("Bot is connected!");
        if (connection === "close") {
            const err = lastDisconnect?.error;
            const code = err?.output?.statusCode;
            console.log(`Error: ${err}\nStatus Code: ${code}`);
            
            if (code === 401) {
                console.log("Logged out. Delete auth folder and try again.");
                return;
            }
            
            console.log("Reconnecting in 7secs...");
            qrRequested = false;
            pairCodeRequested = false;
            fs.remove("auth");
            if (typeof reconnect === "function") {
                setTimeout(reconnect, 7000);
            }
        }
    });
    
    sock.ev.on("messages.upsert", async({ messages, type }) => {
        if (type !== "notify") return;
        for (const m of messages) {
            if (!m) continue;
            await handleMessage(sock, m); 
        };
    });
}

module.exports = { handleEvents };