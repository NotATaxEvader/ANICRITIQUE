const Admin = require('../Model/AdminModel');

async function loginAdminCont(req, res) {
  const { username, password } = req.body; // Use "password" here to match the UserModel

  try {
    // Check if the user exists in the database
    const admin = await Admin.findOne({ username: 'admin' });

    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches the user's password in the database
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store the username in the session
    req.session.username = username;

    // Login successful, send a success response
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    // Handle any errors that may occur during login
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
}

module.exports = loginAdminCont;