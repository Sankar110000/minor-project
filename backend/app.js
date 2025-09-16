const express = require('express');
const userRouter = require('./routes/user.routes');
const app = express();

app.use(express.json())

app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.json({messgae: "working"})
})

module.exports = app