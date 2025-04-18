const Datastore = require('gray-nedb');

class BookingDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      this.db = new Datastore();
    }
  }

  // Add a booking
  bookCourse(booking) {
    this.db.insert(booking, (err, doc) => {
      if (err) {
        console.log('Booking error:', err);
      } else {
        console.log('Booking saved:', doc);
      }
    });
  }

  // ✅ Get all bookings for a given course
  getBookingsByCourse(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId: courseId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Get all bookings for a given session
  getBookingsBySession(sessionId) {
    return new Promise((resolve, reject) => {
      this.db.find({ sessionId: sessionId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Get all bookings for a user
  getBookingsByUser(username) {
    return new Promise((resolve, reject) => {
      this.db.find({ username: username }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Cancel booking
  cancelBooking(bookingId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: bookingId }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  }
}

module.exports = new BookingDAO('./database/bookings.db');
