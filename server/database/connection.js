const mongoose = require('mongoose');

const mongo_url = 'mongodb+srv://admin:123@cluster0.uvntv.mongodb.net/users?retryWrites=true&w=majority';


const connectDB = async()=>{
    try{
        const con = await mongoose.connect(mongo_url);
    }catch(err){
        process.exit(1);
    }
}

module.exports = connectDB;