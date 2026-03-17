// src/utils/commandsLoader.js

const { commandsDir } = require("../../config/paths.js");
const fs = require("fs");
const path = require("path");

function loadCommands () {
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));
    
    const commands = new Map();
    
    for (const file of files) {
        const fullPath = path.join(commandsDir, file);
        const cmd = require(fullPath);
        
        if (!cmd.name || !cmd.run) continue;
        
        commands.set(cmd.name.toLowerCase(), cmd);
    }
    return commands;
}

module.exports = { loadCommands };