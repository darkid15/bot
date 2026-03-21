/*
 * Nano-MD Authorization System
 *
 * Handles:
 * - User identity decoding (LID support)
 * - Role detection (master, owner, officers)
 * - Permission checks
 */

const { jidDecode } = require("baileys");
const { roles } = require("../../config/index.js");

/*
 * Decode sender into real phone number
 *
 * @param {object} m - baileys message
 * @returns {string|null}
 */
function getUserId(m) {
    const rawSender = m.key.participant || m.key.remoteJid;

    if (!rawSender) return null;

    // Handle LID format
    if (rawSender.endsWith("@lid")) {
        const decoded = jidDecode(rawSender);
        return decoded?.user || null;
    }

    // Normal JID
    return rawSender.split("@")[0];
}

/*
 * Get user role
 *
 * @param {string} userId
 * @returns {string|null}
 */
function getUserRole(userId) {
    if (!userId) return null;

    if (userId === roles.master) return "master";
    if (userId === roles.owner) return "owner";
    if (roles.officers.includes(userId)) return "officer";

    return null;
}

/*
 * Check if user is authorized
 *
 * @param {object} m
 * @returns {object}
 */
function checkAuth(m) {
    const userId = getUserId(m);

    if (!userId) {
        return { authorized: false, reason: "invalid_user" };
    }

    const role = getUserRole(userId);

    if (!role) {
        return {
            authorized: false,
            reason: "not_allowed",
            userId
        };
    }

    return {
        authorized: true,
        role,
        userId
    };
}

function isGroup (jid) {
  if (!jid.endsWith("@g.us")) return false;
  return true;
}

module.exports = {
    getUserId,
    getUserRole,
    checkAuth,
    isGroup
};