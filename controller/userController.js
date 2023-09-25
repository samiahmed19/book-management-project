const User = require('../models/User');
const db = require('../config/db');
const Books = require('../models/Book');

exports.getPage = async(req,res)=>{
    try{
        res.render('user',{

        })
    }
    catch(err){
        
    }
}
exports.getLogin = async(req,res)=>{
    try{
        res.render('login',{

        });
        
    }
    catch(err){
        
    }
}
exports.getAddBook = async(req,res)=>{
    try{
        res.render('addBook',{
            
        })
    }
    catch(err){

    }
}
exports.verifyLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const existingEmail = await User.findOne({email});
        
        if(!(existingEmail.password == password) || !existingEmail){
            return res.status(401).json({error:'Invalid email and password'});
        }
        req.session.user = existingEmail;
        // const passwordMatch = await bcrypt.compare(password,existingUser.password);
        return res.redirect('/profile');
    }
    catch(err){
        console.error('Error in verifying login:', err);
        return res.redirect('/login');
    }
}
exports.createUser = async(req,res)=>{
    try{
        const {name,password,email} = req.body;
        const existingEmail = await User.findOne({email})
            if(existingEmail){
                return res.send("Error email id is already present");
            }
        const userCreated = await User.create({name,password,email});
        console.log('User Registered Successfully',userCreated);
        return res.redirect('back');
        
    }
    catch(err){
        console.log('error in creating a new user',err);
        return res.redirect('back');
    }
}

exports.getProfile = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Render the user profile page with user details
        res.render('profile', { user_details: req.session.user });
    } catch (err) {
        console.error('Error in loading profile:', err);
        res.redirect('/login');
    }
}
exports.addBook = async(req,res)=>{
    try{
        const {title,author,isbn,price,quantity} = req.body;
        const bookAdded = await Books.create({title,author,isbn,price,quantity});
        console.log("Book is added",bookAdded);
        return res.redirect('back');
        // res.render('addBook',{

        // })
    }
    catch(err){

    }
    
}
exports.getBooks = async(req,res)=>{
    try{
        const books = await Books.find({}).exec();
        res.render('getBook',{
            books_list:books
        });
    }
    catch(err){

    }
}

//delete book
exports.deleteBook = async(req,res)=>{
    try{
        let id = req.query.id;
        const deleted = await Books.findByIdAndDelete(id);
        console.log('Contact Deleted',deleted);
        return res.redirect('back');
    }
    catch(err){
        console.log('error in deleting the book');
        return res.redirect('back');
    }
}