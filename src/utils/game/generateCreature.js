// utils/game/generateCreature.js

function getRandomTier() {
    const rand = Math.random() * 100;

    if (rand < 60) return "ordinary";
    if (rand < 85) return "primitive";
    if (rand < 95) return "mutant";
    if (rand < 99) return "sacred";
    return "super";
}

function generateCreature(sanctuary) {
    const tier = getRandomTier();

    const baseStats = {
        ordinary: 5,
        primitive: 15,
        mutant: 30,
        sacred: 60,
        super: 120
    };

    const power = baseStats[tier] * sanctuary;

    return {
        name: `${tier.toUpperCase()} Beast`,
        tier,
        stats: {
            attack: power,
            defense: power * 0.8,
            hp: power * 2
        }
    };
}

module.exports = generateCreature;