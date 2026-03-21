// src/commands/announce.js 

const enqueueReply = require("../utils/message/replyQueue.js");
const db = require("../database");

async function run ({ sock, m, args }) {
    const allGroups = db.getAllGroups();
    
    const gJid = allGroups.jid;
}

module.exports = {
  name: "announce",
  description: "Send an announcement to all Super Gene Groups",
  category: "system",
  usage: "announce"
}