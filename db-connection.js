const mongoose = require('mongoose');
const db = mongoose.connect(process.env.DB, { useNewUrlParser: true });

module.exports = db;