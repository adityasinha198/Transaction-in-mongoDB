const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema


const userSchema = new mongoose.Schema({
name: String,
email: String,
jobs: [mongoose.Schema.Types.ObjectId]
    });


module.exports = mongoose.model("user",userSchema)
