const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    loginStatus: { type: String, default: 'active' },
    loginAttempts: { type: Number, default: 0 },
    expire: Date,
})

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel }