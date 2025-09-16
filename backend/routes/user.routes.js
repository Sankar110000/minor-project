const { registerUser, loginUser } = require('../controllers/user.controller')

const userRouter = require('express').Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

module.exports = userRouter