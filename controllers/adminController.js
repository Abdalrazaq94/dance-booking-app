const courseModel = require('../models/courseModel');
const bookingModel = require('../models/bookingModel');
const userDao = require('../models/userModel');
const classModel = require('../models/classModel');
const workshopModel = require('../models/workshopModel');
const userModel = require('../models/userModel');

// Admin Dashboard
exports.show_admin = function (req, res) {
  courseModel.getAllCourses().then((courses) => {
    res.render("admin/dashboard", {
      title: 'Admin Dashboard',
      user: "admin",
      courses
    });
  });
};

// Show Add Course Page
exports.show_add_course = (req, res) => {
  res.render("admin/addCourse", { title: "Add Course" });
};

// Handle Add Course
exports.add_course = (req, res) => {
  const course = {
    name: req.body.name,
    duration: req.body.duration,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
  };

  courseModel.addCourse(course);
  res.redirect("/admin");
};

// Delete Course
exports.delete_course = (req, res) => {
  const id = req.params.id;
  courseModel.deleteCourse(id);
  res.redirect("/admin");
};

// Show Enrolments
exports.show_enrolments = (req, res) => {
  const courseId = req.params.id;

  Promise.all([
    courseModel.getCourseById(courseId),
    bookingModel.getBookingsByCourse(courseId)
  ])
    .then(([course, bookings]) => {
      res.render("admin/enrolledList", {
        course,
        bookings
      });
    })
    .catch((err) => {
      console.log("Error loading enrolments:", err);
      res.status(500).send("Error loading enrolments");
    });
};

// Show Add Class Session Form
exports.show_add_session = (req, res) => {
  res.render("admin/addSession", {
    title: "Add Session",
    courseId: req.params.id
  });
};

// Handle Add Session
exports.add_session = (req, res) => {
  const courseId = req.params.id;
  const { date, time } = req.body;

  classModel.addSession(courseId, date, time);
  res.redirect("/admin");
};

// Show Add Workshop Form
exports.show_add_workshop = (req, res) => {
  res.render("admin/addWorkshop", {
    courseId: req.params.id,
    title: "Add Workshop"
  });
};

// Handle Add Workshop Submission
exports.add_workshop = (req, res) => {
  const courseId = req.params.id;
  const { topic, date, time } = req.body;

  workshopModel.addWorkshop(courseId, topic, date, time);
  res.redirect("/admin");
};

// Add User Form (Optional)
exports.admin_add_new_user = function (req, res) {
  res.render('admin/addUser', { user: "admin", title: "Add User" });
};

// Handle New User Registration (from Admin)
exports.admin_post_new_user = function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.pass;
  const role = req.body.role;

  if (!username || !email || !password) {
    return res.status(401).send("Missing fields");
  }

  userDao.lookupByEmail(email, function (err, existingUser) {
    if (existingUser) {
      return res.status(401).send("User already exists");
    }

    userDao.create(username, email, password, role);
    res.render("admin/userAdded", { title: "User Added" });
  });
};

// Show addAdmin form
exports.showAddAdmin = (req, res) => {
  res.render('admin/addAdmin', {
    title: "Add Admin or User",
    user: req.user.username
  });
};

// Handle admin/user creation from form
exports.addAdmin = (req, res) => {
  const { username, email, pass, role } = req.body;

  if (!username || !email || !pass || !role) {
    return res.status(400).send("All fields are required.");
  }

  userDao.lookupByEmail(email, (err, existingUser) => {
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    userDao.create(username, email, pass, role);
    res.redirect('/admin');
  });
};

// edit course 

// Show Edit Course Page
exports.show_edit_course = (req, res) => {
  const courseId = req.params.id;

  courseModel.getCourseById(courseId).then((course) => {
    res.render("admin/editCourse", {
      title: "Edit Course",
      course
    });
  }).catch(err => {
    console.error("Course not found:", err);
    res.status(404).send("Course not found");
  });
};

// Handle Update Course
exports.update_course = (req, res) => {
  const courseId = req.params.id;
  const updatedCourse = {
    name: req.body.name,
    duration: req.body.duration,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price
  };

  courseModel.updateCourse(courseId, updatedCourse);
  res.redirect('/admin');
};


// show user 
exports.showAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();  
    res.render('admin/userList', {
      title: "All Users",
      users: users,
      user: req.user.username
    });
  } catch (err) {
    console.error("Error loading users:", err);
    res.status(500).send("Error loading users.");
  }
};


// Delete a user
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  userModel.deleteById(userId, (err) => {
    if (err) return res.status(500).send("Failed to delete user");
    res.redirect('/admin/users');
  });
};