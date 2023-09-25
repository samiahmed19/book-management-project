const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

exports.signUp = async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const isPasswordValid = user.comparePassword(req.body.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      {
        name: req.body.name,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profile update failed' });
  }
};
