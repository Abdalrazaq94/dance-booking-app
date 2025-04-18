const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Login middleware using email
exports.login = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.pass;

  userModel.lookupByEmail(email, function (err, user) {
    if (err) {
      console.log("Error looking up user by email:", err);
      return res.status(401).send("Login failed");
    }

    if (!user) {
      console.log("User not found with email:", email);
      return res.render("user/login", {
        title: "Login",
        error: "Email not found",
        redirectTo: req.query.redirectTo || "/"
      });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const payload = {
          username: user.user,
          email: user.email,
          role: user.role,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 300, // 5 minutes
        });

        res.cookie("jwt", accessToken);

        // Redirect based on user role
        if (user.role === "admin") {
          return res.redirect("/admin");
        } else {
          return res.redirect("/");
        }

      } else {
        return res.render("user/login", {
          title: "Login",
          error: "Invalid password",
          redirectTo: req.query.redirectTo || "/"
        });
      }
    });
  });
};

// Middleware to verify any logged-in user
exports.verify = function (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send("Invalid token.");
  }
};

// Middleware to verify admin user
exports.verifyAdmin = function (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).send("No token.");
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).send("Admins only.");
    }

    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send("Invalid token.");
  }
};
