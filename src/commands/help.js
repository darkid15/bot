// src/commands/help.js

const { enqueueReply } = require("../utils/message/replyQueue");

async function run({ sock, m, args, commands }) {
    if (!args || args.length !== 1) {
        return await enqueueReply(sock, m, {
            text: "Usage: !help <command>"
        });
    }

    const query = args[0].toLowerCase();
    let cmdFound;

    for (const cmd of commands.values()) {
        const nameMatch = cmd.name === query;
        const aliasMatch = cmd.aliases?.includes?.(query);

        if (nameMatch || aliasMatch) {
            cmdFound = cmd;
            break;
        }
    }

    if (!cmdFound) {
        return await enqueueReply(sock, m, {
            text: `❌ Command "${query}" not found.`
        });
    }

    const aliases =
        cmdFound.aliases && cmdFound.aliases.length
            ? cmdFound.aliases.join(", ")
            : "None";

    const response = `
📌 Name: ${cmdFound.name}
📝 Desc: ${cmdFound.description}
📂 Category: ${cmdFound.category}
⚙️ Usage: ${cmdFound.usage}
🔁 Aliases: ${aliases}
`.trim();

    return await enqueueReply(sock, m, { text: response });
}

module.exports = {
    name: "help",
    description: "Shows info about commands",
    category: "system",
    usage: "!help <command>",
    aliases: [],
    run
};


module.exports = {
    name: "help",
    description: "Shows info about commands",
    category: "system",
    usage: `!help`,
    aliases: [],
    run
}