const dotenv = require('dotenv');
dotenv.config({
    path: "./.env"
})
const app = require("./app.js")
const DBconnect = require('./dbConfig/connectDB');

const port = process.env.PORT || 8080

DBconnect()
.then(() => {
    app.listen(port, () => {
        console.log(`App is listening on port ${port}`)
    })
})
.catch(err => {
    console.log("Error while starting the app",err)
})
