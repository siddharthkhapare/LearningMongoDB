const mongoose = require('mongoose');

const connectToDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("DB connection successfull");
    }catch(err){
        console.log("DB connection failed", err);
    }
}

module.exports = {
    connectToDB
}