// src/handler/msgHandler.js

const { getContentType } = require("baileys");
const { allowedNumbers, prefix } = require("../../config/index.js");
const sendReply = require("../utils/sendReply.js");
const { loadCommands } = require("../utils/commandsLoader.js");
const { checkAuth } = require("../utils/auths.js");

const commands = loadCommands();

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
        console.log("Extracted content type:", contentType);
        
        if (!text.startsWith(prefix)) return;
        
        // Check if user is authorized to use bot
        const auth = checkAuth(m);
        if (!auth.authorized) {
            console.log("Unauthorized user:", auth.userId);
            return;
        }
        
        const withoutPrefix = text.slice(prefix.length).trim().toLowerCase();
        
        const [cmdName, ...args] = withoutPrefix.split(/\s+/);
        
        const cmd = commands.get(cmdName);
        
        if (!cmd) return;
        
        await cmd.run({
            sock, 
            m,
            prefix,
            args
        });
        
    } catch (err) {
        console.error(`Handler error: ${err.stack || err}`);
    }
}

module.exports = handleMessage;