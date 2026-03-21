// src/commands/register.js

const ldsh = require("lodash");
const DBManager = require("../database/dbManager.js");
const { prefix, masterNumber } = require("../../config/index.js")
const {enqueueReply} = require("../utils/message/replyQueue.js");
const calcFitness = require("../utils/game/calcFitness.js");
const formatProfile = require("../utils/game/formatProfile.js");
const { dbFile } = require("../../config/paths.js");
const db = require("../database");

async function run ({ sock, m, args }) {
    try {// If no arguments
        if (!args || args.length == 0) return await enqueueReply(sock, m , "Use !register [name]");
        const name = args.join(" ") || "Player";
        const rawUserId = m.key.participant || m.key.remoteJid;
        const userId = rawUserId.split("@")[0];
        
        const userInfo = db.getUser(userId);
        let cooldown = { min: 500, max: 1000 }
        if (userInfo) return await enqueueReply(sock, m, "You are already registered!", cooldown)
        
        const isMaster = userId.split("@")[0] === masterNumber;
        
        const defaultStats = {
            level: isMaster ? 0 : 1,
            
            // Location
            sanctuary: 1,
            shelter: "Steel Armor Shelter",
            
            // status
            evo_status: isMaster ? "Demigod" : "Unevolved",
            social_status: isMaster ? "Progenitor" : "Commoner",
            
            // stats
            lifespan: isMaster ? 0 : 100,
            gold: isMaster ? 0 : 10,
            base_fitness: isMaster ? 0 : 0,
            temp_fitness: isMaster ? 0 : 0,
            
            geno_points: {
                ordinary: isMaster ? 50 : 0,
                primitive: isMaster ? 50 : 0,
                mutant: isMaster ? 50 : 0,
                sacred: isMaster ? 50 : 0,
                super: isMaster ? 50 : 0
            },
            
            stats: {
                attack: isMaster ? 999999999 : 15,
                defense: isMaster ? 999999999 : 15,
                agility: isMaster ? 999999999 : 15,
                luck: isMaster ? 999999999 : 5,
                stamina: isMaster ? 999999999 : 15
            },
            
            inventory: {
                weapons: [],
                armor: [],
                items: []
            },
            
            beast_souls: []
        }
        
        
        try {
            db.addUser(userId, name, defaultStats);
        } catch (err) {
            console.log("Error adding user", err);
        }
        let text = formatProfile(userId, name, defaultStats)
        
        cooldown = { min: 1500, max: 3000 };
        await enqueueReply(sock, m, text, cooldown);
    } catch (err) {
        console.log("Error registering user:", err.stack || err);
    };
}

module.exports = {
    name: "register",
    description: "Register for the _*Super Gene* RPG_ game",
    category: "game",
    usage: `${prefix}register [name]`,
    cooldown,
    run
}