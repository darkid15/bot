
const { createSock } = require("./socket/index.js");
const { handleEvents } = require("./socket/events.js");
const express = require("express");
const db = require("./database");
const fs = require("fs-extra")
const { dataDir } = require("../config/paths.js");


async function startBot () {
    await fs.ensureDir(dataDir);
    await db.init();
    const sock = await createSock();
    await handleEvents(sock, {
        pairCodeLogin: false,
        phoneNumber: process.env.PHONE,
        reconnect: startBot
    });
}

startBot();
process.stdin.resume();