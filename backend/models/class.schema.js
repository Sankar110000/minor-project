const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    classTeacher: {
        type: String,
        reuired: true
    },
    startTime: {
        type: Date,
        default: new Date(Date.now())
    },
    endTime: {
        type: Date,
        required: true
    }
})

const Class = mongoose.model("Class", classSchema)
module.exports = Class