const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');

async function signupController(req, res) {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ username: username, email: email });
  
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      else{
      // Generate a dynamic date for join_date
      const currentDate = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(currentDate);

      const hashPass = await bcrypt.hash(password, 10);
  
      // User does not exist, so insert the new user into the database
      const newUser = await User.create({
        username: username,
        email: email,
        password: hashPass,
        join_date: formattedDate,
        bio: '',
        picture_url: "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"
      });

      await newUser.save();

      req.session.username = username;

      res.redirect('/login');
      }
  } catch (error) {
    // Handle any errors that may occur during registration
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred during registration' });
  }
}

module.exports = signupController;