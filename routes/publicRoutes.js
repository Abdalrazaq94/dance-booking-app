const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicController');
const bookingController = require('../controllers/bookingController');
const { verify } = require('../auth/auth'); // Middleware to check if user is logged in

// Public pages
router.get('/', controller.show_home);
router.get('/about', controller.show_about);

// Courses
router.get('/courses', controller.show_courses);
router.get('/courses/:id', controller.show_course_detail);

// Book a session for a course (only for logged-in users)
router.post('/book/:courseId', verify, bookingController.submit_booking);
router.get('/my-bookings', verify, bookingController.show_user_bookings);


module.exports = router;
