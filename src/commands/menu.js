// src/commands/menu.js

const {
    botName,
    botAlias,
    botVersion,
    bottomBar,
    prefix,
}= require("../../config/index.js");
const { utilsDir } = require("../../config/paths.js");

const { loadCommands } = require(`${utilsDir}/commandsLoader`);
const sendReply = require(`${utilsDir}/sendReply.js`);

async function run({ sock, m, prefix }) {
    const commands = [...loadCommands().values()];

    // group by category
    const groups = {};
    for (const c of commands) {
        if (c.hidden) continue;
        if (!groups[c.category]) groups[c.category] = [];
        groups[c.category].push(c);
    }
    
    let menuText = `${botAlias}
╭━༆  \`BOT MENU\`  ༆━╮
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
`;
    const cooldown = {
        min: 5000,
        max: 9000
    }
    await sendReply(sock, m, menuText);
}

module.exports = {
  name: "menu",
  description: "Shows a menu of all available commands.",
  category: "system",
  usage: `${prefix}menu`,
  run,
};

