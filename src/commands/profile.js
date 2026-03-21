// src/commands/profile.js

const ldsh = require("lodash");
const db = require("../database");
const {enqueueReply} = require("../utils/message/replyQueue.js");
const formatProfile = require("../utils/game/formatProfile.js");
const path = require("path");

async function run ({ sock, m }) {
    const rawUserId = m.key.participant || m.key.remoteJid;
    const userId = rawUserId.split("@")[0];
    const userInfo = db.getUser(userId);
    
    if (!userInfo) {
        return await enqueueReply(sock, m, "You're not registered yet! Use the register command first.");
    }
    const userData = userInfo.data;
    const genoPoints = userData.geno_points;
    
    let text = formatProfile(userId, userInfo.name, userData);

    const profileBanner = path.join(__dirname, "..", "media/profileBanner.jpg");
    // cooldown
    const cooldown = { min: 2500, max: 4000 };
    await enqueueReply(sock, m, { image: profileBanner, caption: text }, cooldown);
}

module.exports = {
    name: "profile",
    description: "Show player profile and stats.",
    category: "game",
    aliases: ["p", "info"],
    usage: "profile, p",
    cooldown,
    run
}