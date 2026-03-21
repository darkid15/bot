// src/commands/groupinfo.js

const {enqueueReply} = require("../utils/message/replyQueue.js");
const { isGroup } = require("../utils/auths.js");
const db = require("../database");

async function run ({sock, m}) {
    const jid = m.key.remoteJid;
    
    if (!isGroup(jid)) return;
    const cleanJid = jid.split("@")[0];
    
    const metadata = await sock.groupMetadata(jid);
    const groupName = metadata.subject;
    const desc = metadata.desc || "No description";
    const members = metadata.participants.length;
    const admins = metadata.participants.filter(p => p.admin).length;

    const response = `
🆔 Group Id: *${cleanJid}*
📛 Name: *${groupName}*
📝 Description: *${desc}*
👥 Members: *${members}*
👑 Admins: *${admins}*

> Powered by _Darkid Bots_`;

        // implement cooldown
        const cooldown = { min: 1500, max: 3000 };
        await enqueueReply(sock, m, response, cooldown);
}

module.exports = {
    name: "groupinfo",
    description: "Gets group metadata",
    category: "group management",
    usage: "groupinfo",
    cooldown,
    run
}