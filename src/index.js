
const { createSock } = require("./socket/index.js");
const { handleEvents } = require("./socket/events.js");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

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