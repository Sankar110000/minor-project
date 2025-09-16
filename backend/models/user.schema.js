const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPresent: {
        type: Boolean,
    },
    subject: {
        type: String
    },
    role: {
        type: String,
        default: "student",
        enum: ["student", "teacher"]
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User