// utils/game/rewards.js

function getRewards(tier) {
    const gained = Math.floor(Math.random() * 10) + 1;
    const rewards = {
        ordinary: { points: gained, soulChance: 0.01 },
        primitive: { points: gained, soulChance: 0.03 },
        mutant: { points: gained, soulChance: 0.08 },
        sacred: { points: gained, soulChance: 0.15 },
        super: { points: gained, soulChance: 0.4 }
    };

    return rewards[tier];
}

function rollBeastSoul(chance) {
    return Math.random() < chance;
}

module.exports = { getRewards, rollBeastSoul };