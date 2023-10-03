const User = require('../models/user');
// const db = require('../config/db.js');
const Books = require('../models/books');
const mongoose = require('mongoose');
const UserBook = require('../models/userBook');
const bcrypt = require('bcrypt');


exports.getAllBooks = async(req,res)=>{
    try{
        if(!req.session.user){
            return res.send("First Enter your login credential to access to all books");
        }
        if(req.session.user.isAdmin==false){
            return res.send("Only Admins can access to all books");
        }
        const books = await Books.find({}).exec();
        res.render('all-books',{
            books_list:books
        });
    }
    catch(err){
        
    }
}

// get update profile page
exports.getUpdateProfile = async(req,res)=>{
    try{
        res.render('updateProfile',{

        });
    }
    catch(err){

    }
}

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
        if(!req.session.user){
            return res.send("First Enter your login credential to access to adding books");
        }
        if(req.session.user.isAdmin==false){
            return res.send("Only Admins can access to these page");
        }
        res.render('addBook',{
            
        })
    }
    catch(err){

    }
}
// const bcrypt = require('bcrypt');
exports.verifyLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const existingEmail = await User.findOne({email});
        
        // if(!(existingEmail.password == password) || !existingEmail){
        //     return res.status(401).json({error:'Invalid email and password'});
        // }
        if (!existingEmail) {
            return res.status(401).json({ error: 'User does not exist.' });
          }
      
          const isPasswordValid = await existingEmail.comparePassword(password);
          if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email and password' });
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
        const {name,password,email,userid} = req.body;
        const existingEmail = await User.findOne({email})
            if(existingEmail){
                return res.send("Error email id is already present");
            }
        const userCreated = await User.create({name,password,email,userid});
        console.log('User Registered Successfully',userCreated);

        //creating user specific book collection
        function generateUserCollectionName(userid){
            return `books_${userid}`;
        }
        async function createUserCollection(userid){
            const userCollectionName = generateUserCollectionName(userid);
            try{
                await mongoose.connection.createCollection(userCollectionName);
                console.log(`User collection "${userCollectionName}" created successfully`);
            }catch(err){
                console.log(`Error in creating user collection: ${err}`);
            }
        }
        createUserCollection(userid);

        return res.redirect('/');
        
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
            return res.redirect('/');
        }

        console.log("testing",req.session.user);
        // Render the user profile page with user details
        
        res.render('profile', { user_details: req.session.user });
    } catch (err) {
        console.error('Error in loading profile:', err);
        res.redirect('/');
    }
}

//Adding Book code  
exports.addBook = async(req,res)=>{
    try{
        const {title,author,isbn,price,quantity} = req.body;
        const bookAdded = await Books.create({title,author,isbn,price,quantity});
        console.log("Book is added",bookAdded);
        return res.redirect('back');
        res.render('addBook',{

        })
    }
    catch(err){

    }
}

//books displaying code
exports.getBooks = async(req,res)=>{
    try{
        if (!req.session.user) {
            return res.redirect('/');
            console.log("User not logged in");
        }
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

//get Search book
exports.getSearchBook = async(req,res)=>{
    try{
        const query = res.query.query;

        const searchResults = books_list.filter((book)=>{
            return (
                book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase())
            );
        });

        res.render('search-results',{results:searchResults});
    }
    catch(err){

    }
}

//addtocart logic
exports.addToCart = async(req,res)=>{
    try{

        const {book_data,quantity} = req.body;
        const bookData = JSON.parse(book_data);
        console.log(bookData);
        if(quantity>bookData.quantity){
            return res.status(401).json({error:'Entered quantity is more than available'});
        }
        bookData.quantity = quantity;
        if(!req.session.user){
            return res.status(401).json({error:'User is not logged in'});
        }
        function generateUserCollectionName(userid){
            return `books_${userid}`;
        }
        // console.log(req.session.user.userid);
        const userCollectionName = generateUserCollectionName(req.session.user.userid);
        console.log(userCollectionName);
        
        // create a mongoose model for the user's book collection
        const UserBooks = mongoose.model(userCollectionName, UserBook.schema);

        //existing book check
        const existingBook = await UserBooks.findOne({isbn: bookData.isbn});
        if(existingBook){
            return res.status(400).json({error:'This book is already in your cart'});
        }

        // insert the book data into the user's collection
        const newBook = new UserBooks(bookData);
        await newBook.save();

        console.log(`Book added to user collection "${userCollectionName} successfully.`);
        return res.redirect('back');

    }catch(err){
        console.error('Error in adding book to user collection:', err);
        // Handle the error appropriately
        return res.redirect('my-cart');
    }
}

exports.getMyCart = async(req,res)=>{
    try{
        if(!req.session.user){
            return res.status(401).json({error:'User is not logged in'});
        }
        function generateUserCollectionName(userid){
            return `books_${userid}`;
        }
        // console.log(req.session.user.userid);
        const userCollectionName = generateUserCollectionName(req.session.user.userid);
        console.log(userCollectionName);

        //user specific books
        const UserBooks = mongoose.model(userCollectionName,UserBook.schema);

        const books = await UserBooks.find({}).exec();
        res.render('cart',{
            book_list:books
        });
        
    }
    catch(err){

    }
}

exports.deleteCartBook = async(req,res)=>{
    try{
        let id = req.query.id;
        function generateUserCollectionName(userid){
            return `books_${userid}`;
        }
        // console.log(req.session.user.userid);
        const userCollectionName = generateUserCollectionName(req.session.user.userid);
        console.log(userCollectionName);

        //user specific books
        const UserBooks = mongoose.model(userCollectionName,UserBook.schema);

        const deleted = await UserBooks.findByIdAndDelete(id);
        console.log('Contact Deleted',deleted);
        return res.redirect('back');
    }
    catch(err){
        console.log('error in deleting the book');
        return res.redirect('back');
    }
}

//admin login
exports.verifyAdminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const existingEmail = await User.findOne({email});
        
        if(!existingEmail || (existingEmail.isAdmin==false)){
            return res.status(401).json({error:'Invalid email and password'});
        }

        const isPasswordValid = await existingEmail.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email and password' });
        }
  

        req.session.user = existingEmail;
        // const passwordMatch = await bcrypt.compare(password,existingUser.password);
        return res.redirect('/admin-profile');
    }
    catch(err){
        console.error('Error in verifying login:', err);
        return res.redirect('/admin-login');
    }
}

exports.adminLogin = async(req,res)=>{
    try{
        return res.render('admin',{

        });
    }
    catch(err){

    }
}

exports.getAdminProfile = async(req,res)=>{
    try{
    if (!req.session.user) {
        return res.redirect('/admin-login');
    }

    console.log("testing",req.session.user);
    // Render the user profile page with user details
    
    res.render('adminProfile', { user_details: req.session.user });
    }
    catch (err) {
    console.error('Error in loading admin profile:', err);
    res.redirect('/admin-login');
}
}

//update profile logic
exports.updateProfile = async(req,res)=>{
    try{
        if (!req.session.user) {
            return res.redirect('/');
            console.log("User not logged in");
        }
        const {name,password} = req.body;
        const loggedIn = req.session.user;

        if(!loggedIn){
            return res.status(404).json({error:'User Not Found'});
        }
        
        const userId = req.session.user._id;
        const hashedPassword = await bcrypt.hash(password,10);
        const updatedUser = await User.findByIdAndUpdate(userId,{name,password:hashedPassword},{new: true});

        // res.json(updatedUser);
        req.session.user.name = updatedUser.name;
        req.session.user.email = updatedUser.email;
        return res.redirect('/profile');
    }
    catch(error){
        return res.status(500).json("Error occured");
    }
}

//update quantity in my cart
exports.updateQuantity = async(req,res)=>{
    try{
        const {book_data,quantity} = req.body;
        const bookData = JSON.parse(book_data);
        const bookId = bookData._id;
        console.log(bookData);
        book_data.quantity = quantity;
        function generateUserCollectionName(userid){
            return `books_${userid}`;
        }
        // console.log(req.session.user.userid);
        const userCollectionName = generateUserCollectionName(req.session.user.userid);

        const userCollection = mongoose.model(userCollectionName);

        const updatedBook = await userCollection.findByIdAndUpdate(bookId,{quantity});
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.redirect('/my-cart');
    }
    catch(err){
        console.log("Error occured",err);
    }
}



  
//update book
exports.updateBook = async (req, res) => {
    try {
      const { title, price, bookId } = req.body;
      const updatedDetails = await Books.findByIdAndUpdate(bookId, { title, price });
  
      if (!updatedDetails) {
        return res.status(404).render('error', { message: 'Book not found' });
      }
      return res.redirect('/all-books');
    } catch (err) {
      console.error('Error in updating book:', err);
      return res.status(500).render('error', { message: 'Internal Server Error' });
    }
  };
// Add a new method to display the "Update Book" page
exports.getUpdateBook = async (req, res) => {
    try {
      const bookId = req.query._id;
      const bookDetails = await Books.findById(bookId);
      // Check if the book details were found
      if (!bookDetails) {
            return res.status(404).render('error', { message: 'Book not found' });
        }

    // Render the "Update Book" page with the book details
        res.render('update-book', { bookDetails });

    } catch (err) {
      console.error('Error in loading update book page:', err);
      res.redirect('/all-books');
    }
  };

exports.updateCart = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      return res.redirect('/my-cart'); // Redirect if the user is not logged in
    }

    // Extract book data and quantity from the request body
    const { book_data, quantity } = req.body;
    const bookData = JSON.parse(book_data);

    // Validate the quantity (you may want to add more validation)
    if (quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Find the book in the user's cart and update its quantity
    const updatedBook = await UserBook.findByIdAndUpdate(
      bookData._id,
      { quantity },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found in cart' });
    }

    return res.redirect('/my-cart');
  } catch (err) {
    console.error('Error in updating cart:', err);
    // Handle the error appropriately
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
exports.getTotal = async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'User is not logged in' });
      }
      function generateUserCollectionName(userid) {
        return `books_${userid}`;
      }
      const userCollectionName = generateUserCollectionName(req.session.user.userid);
      console.log(userCollectionName);
  
      // User-specific books
      const UserBooks = mongoose.model(userCollectionName, UserBook.schema);
  
      // Fetch all books in the user's cart
      const booksInCart = await UserBooks.find({}).exec();
  
      // Calculate the total price
      let totalPrice = 0;
      for (const book of booksInCart) {
        totalPrice += book.price * book.quantity;
      }
  
      res.render('total', {
        books: booksInCart,
        total_price: totalPrice,
      });
    } catch (err) {
      console.error(err);
    }
  };
  




  exports.updateCartQuantity = async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'User is not logged in' });
      }
      for (const key in req.body) {
        if (key.startsWith('quantity_')) {
          const bookId = key.replace('quantity_', '');
          const newQuantity = req.body[key];
  
          // Assuming you have a UserBooks model for the user's cart
          const UserBooks = require('../models/userBook');
  
          // Find the book in the user's cart and update its quantity
          const updatedBook = await UserBooks.findOneAndUpdate(
            { _id: bookId, userId: req.session.user._id }, // Assuming you have a userId field in your UserBooks model
            { quantity: newQuantity },
            { new: true }
          );
  
          if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found in cart' });
          }
  
        }
      }
      res.redirect('/my-carts');
    } catch (err) {
      console.error( err);
    }
  };


  