const Datastore = require('gray-nedb');

class WorkshopDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      this.db = new Datastore(); // in-memory for testing
    }
  }

  // Add a workshop (admin creation)
  addWorkshop(courseId, topic, date, time) {
    if (!courseId || !topic || !date || !time) {
      console.log("Missing workshop data.");
      return;
    }

    const workshop = {
      courseId,
      topic,
      date,
      time,
      type: 'admin' // to distinguish admin-created workshops
    };

    this.db.insert(workshop, (err, doc) => {
      if (err) console.log("Error adding workshop:", err);
      else console.log("Workshop added:", doc);
    });
  }

  // Book a workshop (by a user)
  bookWorkshop(booking) {
    if (!booking.username || !booking.courseId || !booking.date || !booking.time) {
      console.log("Missing workshop booking info.");
      return;
    }

    const workshopBooking = {
      ...booking,
      type: 'workshop' //  important for filtering in views
    };

    this.db.insert(workshopBooking, (err, doc) => {
      if (err) console.log("Error booking workshop:", err);
      else console.log("Workshop booking saved:", doc);
    });
  }

  // Get admin-created workshops for a specific course
  getWorkshopsByCourse(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId, type: 'admin' }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Get workshops booked by a specific user
  getWorkshopsByUser(username) {
    return new Promise((resolve, reject) => {
      this.db.find({ username, type: 'workshop' }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Admin: get all entries (both created and booked)
  getAllWorkshops() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}

module.exports = new WorkshopDAO('./database/workshops.db');
