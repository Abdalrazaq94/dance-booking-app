const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({
        filename: dbFilePath.filename,
        autoload: true,
      });
    } else {
      this.db = new Datastore(); // in-memory
    }
  }

  // Create a new user (with duplicate check)
  create(username, email, password, role) {
    const that = this;

    this.db.findOne({ $or: [{ user: username }, { email: email }] }, function (err, existingUser) {
      if (err) {
        console.log("DB error checking user:", err);
        return;
      }

      if (existingUser) {
        console.log("User or email already exists:", existingUser.email);
        return; // Prevent duplicate insert
      }

      bcrypt.hash(password, saltRounds).then(function (hash) {
        const entry = {
          user: username,
          email: email,
          password: hash,
          role: role,
        };
        that.db.insert(entry, function (err, newDoc) {
          if (err) {
            console.log("Can't insert user:", err);
          } else {
            console.log("User created:", newDoc.user);
          }
        });
      });
    });
  }

  // Lookup by username
  lookup(username, cb) {
    this.db.find({ user: username }, function (err, entries) {
      if (err || entries.length === 0) {
        return cb(null, null);
      }
      return cb(null, entries[0]);
    });
  }

  // Lookup by email
  lookupByEmail(email, cb) {
    this.db.find({ email: email }, function (err, entries) {
      if (err || entries.length === 0) {
        return cb(null, null);
      }
      return cb(null, entries[0]);
    });
  }

  // Get all users
  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, users) => {
        if (err) reject(err);
        else {
          console.log("All users loaded:", users);
          resolve(users);
        }
      });
    });
  }

  // Delete by ID
  deleteById(id, callback) {
    this.db.remove({ _id: id }, {}, callback);
  }

  // Initial test users, added only if DB is empty
  init() {
    this.db.count({}, (err, count) => {
      if (err) {
        console.log("Error checking DB count:", err);
        return;
      }

      console.log("Current user count:", count);

      if (count === 0) {
        console.log("Initializing default users...");
        this.create("admin", "admin@gmail.com", "12345678", "admin");
        this.create("admin2", "admin2@gmail.com", "12345678", "admin"); 
        this.create("testuser", "test@example.com", "testpass", "normalUser");
      } else {
        console.log("Users already initialized.");
      }
    });
  }
}

// Initialize DAO with DB file
const dao = new UserDAO({ filename: "users.db", autoload: true });
dao.init();

module.exports = dao;
