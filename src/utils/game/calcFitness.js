// src/utils/calcFitness.js

function calcFitness(geno, evo) {
    let fitness =
        Math.floor(geno.ordinary / 100) * 2 +
        Math.floor(geno.primitive / 100) * 3 +
        Math.floor(geno.mutant / 100) * 4 +
        Math.floor(geno.sacred / 100) * 6 +
        Math.floor(geno.super / 100) * 15;

    const multipliers = {
        Unevolved: 1,
        Evolved: 2,
        Surpasser: 4,
        Demigod: 8
    };

    return fitness * (multipliers[evo] || 1);
}

module.exports = calcFitness;