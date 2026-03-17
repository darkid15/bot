// config/index.js

require("dotenv").config();

const botName = process.env.BOT_NAME;
const botAlias = process.env.BOT_ALIAS;
const botVersion = process.env.BOT_VERSION;
const prefix = process.env.BOT_PREFIX || "!";

const masterNumber = process.env.MASTER_PHONE;
const ownerNumber = process.env.OWNER_PHONE;
const bottomBar= '╰━━━━━━━━━━━━━━━━╯';

const allowedNumbers = [masterNumber];

roles = {
    master: process.env.MASTER_PHONE,
    owner: process.env.OWNER_PHONE,
    officers: process.env.OFFICERS
        ? process.env.OFFICERS.split(",")
        : []
}

cooldown = {
    min: 3000,
    max: 8000
}

module.exports = {
    botName,
    botAlias,
    botVersion,
    prefix,
    masterNumber,
    ownerNumber,
    allowedNumbers,
    bottomBar,
    roles
};