const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const { verifyAdmin } = require('../auth/auth');

// Admin dashboard
router.get('/', verifyAdmin, controller.show_admin);

// Add new course
router.get('/add-course', verifyAdmin, controller.show_add_course);
router.post('/add-course', verifyAdmin, controller.add_course);

// Delete course
router.post('/delete-course/:id', verifyAdmin, controller.delete_course);

// View enrolments
router.get('/enrolments/:id', verifyAdmin, controller.show_enrolments);

// Add a session to a course
router.get('/add-session/:id', verifyAdmin, controller.show_add_session);
router.post('/add-session/:id', verifyAdmin, controller.add_session);

// Add workshop
router.get('/add-workshop/:id', verifyAdmin, controller.show_add_workshop);
router.post('/add-workshop/:id', verifyAdmin, controller.add_workshop);

// Add admin or user
router.get('/add-admin', verifyAdmin, controller.showAddAdmin);
router.post('/add-admin', verifyAdmin, controller.addAdmin);

// edit course 
router.get('/edit-course/:id', verifyAdmin, controller.show_edit_course);
router.post('/edit-course/:id', verifyAdmin, controller.update_course);

// check suer 
router.get('/users', verifyAdmin, controller.showAllUsers);
router.post('/delete-user/:id', verifyAdmin, controller.deleteUser);

module.exports = router;
