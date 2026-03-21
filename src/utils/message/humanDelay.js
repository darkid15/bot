// utils/humanDelay.js

const IGNORE_PROBABILITY = 0.005;

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHumanDelay(minMs, maxMs) {
    if (Math.random() < IGNORE_PROBABILITY) {
        return null;
    }
    return randomBetween(minMs, maxMs);
}

module.exports = { getHumanDelay };