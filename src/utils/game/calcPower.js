// utils/game/calcPower.js

const calcFitness = require("./calcFitness");

function calcPlayerPower(data) {
    const fitness = calcFitness(data.geno_points, data.evo_status);

    return (
        data.stats.attack +
        data.stats.defense +
        data.stats.agility +
        (fitness * 2)
    );
}

module.exports = calcPlayerPower;