const bookingModel = require('../models/bookingModel');
const workshopModel = require('../models/workshopModel');

// Handle booking submission (session or workshop)
exports.submit_booking = (req, res) => {
  const sessionId = req.params.sessionId;
  const user = req.user;

  if (!user) {
    return res.status(401).send("You must be logged in to book.");
  }

  const { courseId, date, time, type, topic } = req.body;

  if (!courseId || !date || !time) {
    return res.status(400).send("Missing booking information.");
  }

  const booking = {
    username: user.username,
    courseId,
    sessionId,
    date,
    time,
    bookedAt: new Date().toISOString()
  };

  // Include topic if it's a workshop
  if (type === 'workshop') {
    booking.topic = topic;
    workshopModel.bookWorkshop(booking);
  } else {
    bookingModel.bookCourse(booking);
  }

  res.render("public/bookingSuccess", {
    title: "Booking Confirmed",
    user: user.username,
    courseId,
    date,
    time
  });
};

// Show all bookings made by the logged-in user
exports.show_user_bookings = async (req, res) => {
  const username = req.user.username;

  try {
    const [sessionBookings, workshopBookings] = await Promise.all([
      bookingModel.getBookingsByUser(username),
      workshopModel.getWorkshopsByUser(username)
    ]);

    const hasBookings = sessionBookings.length > 0 || workshopBookings.length > 0;

    res.render("user/myBookings", {
      title: "My Bookings",
      user: username,
      sessionBookings,
      workshopBookings,
      hasBookings
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
    res.status(500).send("Error loading your bookings.");
  }
};
