
const db = require("../database");
const { enqueueReply } = require("../utils/message/replyQueue");
const ldsh = require("lodash");

async function run ({ sock, m }) {
    const rawUserId = m.key.participant || m.key.remoteJid;
    const userId = rawUserId.split("@")[0];
    const user = db.getUser(userId);
    
    if (!user) {
        return await enqueueReply(sock, m, "Register first using the !register command");
    }
    
    let text;
    const beastSouls = user.data.beast_souls;
    const name = ldsh.startCase(name);
    text += `*${name}'s Beast Souls*:\n`;
    for (const beastSoul of beastSouls) {
        text += `\n- Name: *${beastSoul.name}*\n- Tier: *${beastSoul.tier}*\n`;
    }
    text += `\nNumber of beast souls: ${beastSouls.length}`;
    
    await enqueueReply(sock, m, text);
}

module.exports = {
    name: "beastsoul",
    description: "See all beast souls",
    category: "game",
    aliases: ["bs"],
    usage: "beastsoul, bs",
    run
}