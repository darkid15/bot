// handler/msgHandler.js

const { getContentType } = require("baileys");

async function handleMessage (sock, m) {
    try {
        if (!m.message) return;
        
        const sender = m.key.participant || m.key.remoteJid;
        const jid = m.key.remoteJid;
        
        // Handle message types
        let text;
        const content = m.message;
        const contentType = await getContentType(content);
        if (contentType === "conversation") {
            text = content.conversation;
        } else if (contentType === "extendedTextMessage") {
            text = content.extendedTextMessage.text;
        }
        else return;
        
        if (!text.startsWith("!")) return;
        
        await sock.sendMessage(jid, { text: "Daniel is busy, text him later!" });
    } catch (err) {
        console.error(`Handler error: ${err.stack || err}`);
    }
}

module.exports = handleMessage;