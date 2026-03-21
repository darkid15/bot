// src/utils/commandsLoader.js

const { commandsDir } = require("../../config/paths.js");
const fs = require("fs");
const path = require("path");

function loadCommands () {
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));
    
    const commands = new Map();
    const aliases = new Map();
    
    for (const file of files) {
        const fullPath = path.join(commandsDir, file);
        const cmd = require(fullPath);
        
        if (!cmd.name || !cmd.run) continue;
        
        commands.set(cmd.name.toLowerCase(), cmd);
        
        if (cmd.aliases && Array.isArray(cmd.aliases)) {
            for (const alias of cmd.aliases) {
                aliases.set(alias.toLowerCase(), cmd);
            }
        }
    }
    console.log([...commands.values()].map(c => c.name));
    return { commands, aliases };
}

module.exports = { loadCommands };