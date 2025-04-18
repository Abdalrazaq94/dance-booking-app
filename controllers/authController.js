const userDao = require('../models/userModel');

// Show login page
exports.show_login = (req, res) => {
  const redirectTo = req.query.redirectTo || '/';
  res.render("user/login", {
    title: "Login",
    redirectTo
  });
};

// Handle login (after JWT middleware verifies and sets req.user)
exports.handle_login = (req, res) => {
  const user = req.user;
  const redirectTo = req.body.redirectTo || (user.role === 'admin' ? '/admin' : '/');
  res.redirect(redirectTo);
};

// Show registration page
exports.show_register_page = (req, res) => {
  res.render("user/register", { title: "Register" });
};

//  Handle user registration with duplicate check
exports.post_new_user = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.pass;
  const role = req.body.role || "normalUser"; // Default to normalUser if not provided

  if (!username || !email || !password) {
    return res.status(400).send("Please provide username, email, and password.");
  }

  // First, check if email already exists
  userDao.lookupByEmail(email, (err, existingByEmail) => {
    if (existingByEmail) {
      return res.status(409).send("Email already registered.");
    }

    // Then check if username already exists
    userDao.lookup(username, (err, existingByUsername) => {
      if (existingByUsername) {
        return res.status(409).send("Username already taken.");
      }

      // If both email and username are unique, create user
      userDao.create(username, email, password, role);
      res.redirect("/login");
    });
  });
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};
