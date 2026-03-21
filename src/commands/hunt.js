const db = require("../database");
const { enqueueReply } = require("../utils/message/replyQueue");
const generateCreature = require("../utils/game/generateCreature");
const calcPlayerPower = require("../utils/game/calcPower");
const calcFitness = require("../utils/game/calcFitness");
const { getRewards, rollBeastSoul } = require("../utils/game/rewards");
const { clamp } = require("../utils/game/helpers");

async function run({ sock, m }) {
    const rawUserId = m.key.participant || m.key.remoteJid;
    const userId = rawUserId.split("@")[0];

    const user = db.getUser(userId);
    if (!user) {
        return enqueueReply(sock, m, "Register first using !register");
    }

    const data = user.data;

    // Generate creature
    const creature = generateCreature(data.sanctuary);

    const playerPower = calcPlayerPower(data);
    const creaturePower =
        creature.stats.attack +
        creature.stats.defense +
        creature.stats.hp;

    let resultText = `🐺 *Hunt Result*\n\n`;
    resultText += `You encountered a *${creature.name}*\n\n`;
    
    // Get present temp_fitness
    let oldTempFitness = data.temp_fitness;

    if (playerPower >= creaturePower) {
        // WIN
        const rewards = getRewards(creature.tier);
        data.geno_points[creature.tier] += rewards.points;

        let soulText = "";

        if (rollBeastSoul(rewards.soulChance)) {
            data.beast_souls.push({
                name: `${creature.tier} Beast Soul`,
                tier: creature.tier
            });
            soulText = "\n\n🧿 You obtained a Beast Soul!";
        }
        
        for (let geno_tier in data.geno_points) {
            data.geno_points[geno_tier] = clamp(data.geno_points[geno_tier], 0, 100);
        }
        
        const newTempFitness = calcFitness(data.geno_points, data.evo_status);
        
        if (newTempFitness > oldTempFitness) {
            const delta = newTempFitness - oldTempFitness;
            data.base_fitness += delta;
        }
        
        data.temp_fitness = newTempFitness;

        db.updateUser(userId, data);

        resultText += `✅ You defeated it!\n`;
        resultText += `You devoured the creature meat and gained *${rewards.points} ${creature.tier} geno points!*`;
        resultText += soulText;

    } else {
        // LOSE
        resultText += `❌ You were defeated...\n`;
        resultText += `Recover and try again.`;
    }

    await enqueueReply(sock, m, resultText, { min: 1500, max: 3000 });
}

module.exports = {
    name: "hunt",
    description: "Hunt creatures",
    category: "game",
    aliases: ["explore", "h"],
    usage: "hunt",
    run
};