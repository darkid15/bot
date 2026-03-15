
const { createSock } = require("./socket/index.js");
const { handleEvents } = require("./socket/events.js");

async function startBot () {
    const sock = await createSock();
    await handleEvents(sock, {
        pairCodeLogin: false,
        phoneNumber: process.env.PHONE,
        reconnect: startBot
    });
}

startBot();
process.stdin.resume();