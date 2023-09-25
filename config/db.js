const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://bookstore_db:bookstore@cluster0.ws5g4dn.mongodb.net/');

const db=mongoose.connection;

db.on('error',(error)=>{
    console.error("Error to connect the database",error)
});
db.once('open',function(){
  console.log("successfully connected to the database")
});

/*
module.exports = {
  secretKey: 'your-secret-key',
  databaseURL: 'mongodb://localhost/bookstore_db', // Change to your MongoDB URL
  port: process.env.PORT || 3000,
};

*/