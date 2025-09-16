const mongoose = require('mongoose')

const DB_URL = process.env.DB_URL 
const DB_NAME = "attendance_system"

async function DBconnect(){
    try {
        const connection = await mongoose.connect(`${DB_URL}${DB_NAME}`)
        console.log(`Connection successfull , Host: ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = DBconnect