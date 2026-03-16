// config/index.js

const masterNumber = process.env.MASTER_PHONE;
const ownerNumber = process.env.OWNER_PHONE;
const bottomBar= '╰━━━━━━━━━━━━━━━━╯';

const allowedNumbers = [masterNumber, ownerNumber];

module.exports = {
    masterNumber,
    ownerNumber,
    allowedNumbers
};