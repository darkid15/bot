/*
 * Nano-MD Message Sender Utility
 *
 * Simplifies sending replies (text, media, etc.)
 */

const fs = require("fs");

/*
 * sendReply
 *
 * @param {object} sock - baileys socket
 * @param {object} msg - original message object
 * @param {object|string} content - message content
 * @param {object} options - additional options
 */

async function sendReply(sock, msg, content, options = {}) {

    const jid = msg.key.remoteJid;

    // If content is just a string convert it to text message
    if (typeof content === "string") {
        content = { text: content };
    }

    // Handle local file paths automatically
    if (content.image && typeof content.image === "string") {
        content.image = fs.readFileSync(content.image);
    }

    if (content.video && typeof content.video === "string") {
        content.video = fs.readFileSync(content.video);
    }

    if (content.audio && typeof content.audio === "string") {
        content.audio = fs.readFileSync(content.audio);
    }

    if (content.document && typeof content.document === "string") {
        content.document = fs.readFileSync(content.document);
    }

    if (content.sticker && typeof content.sticker === "string") {
        content.sticker = fs.readFileSync(content.sticker);
    }

    // Send message
    return await sock.sendMessage(
        jid,
        content,
        {
            quoted: msg,
            ...options
        }
    );
}

module.exports = sendReply;