// utils/replyQueue.js

const sendReply = require("./sendReply.js"); // updated to your new module
const { getHumanDelay } = require("./humanDelay.js");

const queue = [];
let processing = false;


function enqueueReply(sock, m, content, cooldown={min: 2000, max: 5000}, options={} ) {
    const delay = getHumanDelay(cooldown.min, cooldown.max);
    if (delay === null) return; // skip occasionally to simulate randomness

    queue.push({ sock, m, content, options, delay });
    processQueue();
}

/**
 * Process the queued messages sequentially
 */
async function processQueue() {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
        const job = queue.shift();
        const jid = job.m.key.remoteJid;

        try {
            // Show "typing" presence before sending
            await job.sock.sendPresenceUpdate("composing", jid);
            await new Promise(r => setTimeout(r, job.delay)); // human delay

            // Send the message using the new sendReply module
            await sendReply(job.sock, job.m, job.content, job.options);
            await job.sock.sendPresenceUpdate("available", jid);

        } catch (err) {
            console.error(`Error sending reply: ${err}`);
        }
    }

    processing = false;
}

module.exports = { enqueueReply };