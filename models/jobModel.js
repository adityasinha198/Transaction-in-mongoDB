const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {ObjectId} = Schema

const jobSchema = new mongoose.Schema({
    title: String,
    location: String,
    salary: String,
    poster: mongoose.Schema.Types.ObjectId
    });

module.exports = mongoose.model("job",jobSchema)