const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://book-manager:book@cluster0.ws5g4dn.mongodb.net/');

const db = mongoose.connection;

db.on('error',(error)=>{
    console.log('error to connecting with database')
})

db.once('open',function(){
    console.log('Successfully connected to database');
})