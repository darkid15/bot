// src/commands/menu.js

const {
    botName,
    botAlias,
    botVersion,
    bottomBar,
    prefix,
}= require("../../config/index.js");
const { utilsDir } = require("../../config/paths.js");

const {enqueueReply} = require(`${utilsDir}/message/replyQueue.js`);
const path = require("path");

async function run({ sock, m, commands }) {
    // group by category
    const groups = {};
    for (const c of commands.values()) {
        if (c.hidden) continue;
        if (!groups[c.category]) groups[c.category] = [];
        groups[c.category].push(c);
    }
    
    let menuText = `
       ╭━༆ ${botAlias} ༆━╮
    
╭━༆  \`SUPER GENE BOT MENU\`  ༆━╮
┃  Prefix: ${prefix}
┃----------------------------
`;

    for (const category in groups) {
        menuText += `┃  ╭━༆  _${category}_  ༆━╮\n`;
        for (const cmd of groups[category]) {
            menuText += `┃  ┃    *${cmd.name}*\n┃  ┃    ${cmd.description}\n`;
        }
        menuText += `┃  ${bottomBar}\n${bottomBar}\n\n`;
    }
    
    menuText += `
Thank you for using ${botName}!

*Bot Version*: *${botVersion}*

> Powered by Darkid Bots`;
    const cooldown = {
        min: 500,
        max: 600
    }
    const menuBanner = path.join(__dirname, "..", "media/menuBanner.jpg");
    
    await enqueueReply(sock, m, { image: menuBanner, caption: menuText });
}

module.exports = {
  name: "menu",
  description: "Shows a menu of all available commands.",
  category: "system",
  usage: `${prefix}menu`,
  cooldown,
  run,
};

