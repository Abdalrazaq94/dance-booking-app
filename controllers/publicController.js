const courseModel = require('../models/courseModel');
const classModel = require('../models/classModel');
const workshopModel = require('../models/workshopModel'); // 

// Show home page
exports.show_home = (req, res) => {
  const user = req.user || null;

  res.render('public/home', {
    title: 'Welcome to Dance Academy',
    user,
    username: user ? user.username : null,
    isAdmin: user?.role === 'admin'
  });
};

// Show about page
exports.show_about = (req, res) => {
  const user = req.user || null;

  res.render('public/about', {
    title: 'About Us',
    user,
    username: user ? user.username : null,
    isAdmin: user?.role === 'admin'
  });
};

// Show list of all courses
exports.show_courses = (req, res) => {
  const user = req.user || null;

  courseModel.getAllCourses()
    .then((courses) => {
      res.render('public/courses', {
        title: 'Available Courses',
        courses,
        hasCourses: courses.length > 0,
        user,
        username: user ? user.username : null,
        isAdmin: user?.role === 'admin'
      });
    })
    .catch((err) => {
      console.log("Error loading courses:", err);
      res.status(500).send("Error loading courses");
    });
};

// Show a specific course and its sessions + workshops
exports.show_course_detail = async (req, res) => {
  const courseId = req.params.id;
  const user = req.user || null;

  try {
    const course = await courseModel.getCourseById(courseId);
    const sessions = await classModel.getSessionsByCourse(courseId);
    const workshops = await workshopModel.getWorkshopsByCourse(courseId);

    if (!course) {
      return res.status(404).send('Course not found');
    }

    res.render('public/courseDetail', {
      title: 'Course Details',
      course,
      courseId: course._id,
      sessions,
      hasSessions: sessions.length > 0,
      workshops,
      hasWorkshops: workshops.length > 0,
      user,
      username: user ? user.username : null,
      isAdmin: user?.role === 'admin',
      loginRedirect: `/courses/${courseId}`
    });
  } catch (err) {
    console.log("Error loading course detail:", err);
    res.status(500).send("Internal server error");
  }
};
