
const path = require("path");

const commandsDir = path.join(__dirname, "..", "src", "commands");
const utilsDir = path.join(__dirname, "..", "src", "utils");
const dataDir = path.join(__dirname, "..", "data");
const dbFile = path.join(dataDir, "botdb.sqlite")

module.exports = {
    commandsDir,
    utilsDir,
    dataDir,
    dbFile
}