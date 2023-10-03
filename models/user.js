const mongoose = require("mongoose");
const bcrypt=require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

userSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });
  userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
const UserData = mongoose.model('UserData',userSchema);
module.exports = UserData;