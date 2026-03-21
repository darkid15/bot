// utils/game/formatProfile.js

const ldsh = require("lodash");
const calcFitness = require("./calcFitness");

/**
 * Formats a player's profile into a WhatsApp-friendly string
 * @param {string} userId - raw WhatsApp ID
 * @param {string} name - player name
 * @param {object} data - player data object
 * @returns {string}
 */
function formatProfile(userId, name, data) {
    const cleanId = userId.split("@")[0];
    const geno = data.geno_points;
    const stats = data.stats;
    let fitness = data.base_fitness;

    /* const temp_fitness = calcFitness(geno, data.evo_status);
    fitness += temp_fitness;*/ 

    let text = `
👤 *Player Profile*

_ID_: *${cleanId}*
_Name_: *${ldsh.startCase(name)}*

📍 *Location*
- Sanctuary: *${data.sanctuary}*
- Shelter: *${data.shelter}*

⚡ *Progression*
- Level: *${data.level}*
- Evolution: *${data.evo_status}*
- Status: *${data.social_status}*
- Lifespan: *${data.lifespan} years*

🧬 *Fitness*: *${fitness}*

🧪 *Geno Points*
- Ordinary: *${geno.ordinary}*
- Primitive: *${geno.primitive}*
- Mutant: *${geno.mutant}*
- Sacred: *${geno.sacred}*
`;

    if (geno.super > 0) {
        text += `- Super: *${geno.super}*\n`;
    }

    text += `
⚔️ *Stats*
- ATK: *${stats.attack}*
- DEF: *${stats.defense}*
- AGI: *${stats.agility}*
- LUCK: *${stats.luck}*
- STA: *${stats.stamina}*

💰 Gold: *${data.gold}*
🧿 Beast Souls: *${data.beast_souls.length}*

> Powered by Darkid Bots
`;

    return text;
}

module.exports = formatProfile;