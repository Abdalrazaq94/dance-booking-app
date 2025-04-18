const Datastore = require("gray-nedb");

class ClassModel {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      this.db = new Datastore(); // in-memory (for testing)
    }
  }

  // Add a class session to a course
  addSession(courseId, date, time) {
    const session = {
      courseId,
      date,
      time,
    };

    this.db.insert(session, (err, doc) => {
      if (err) {
        console.log("Error adding session:", err);
      } else {
        console.log("Session added:", doc);
      }
    });
  }

  // Get all sessions for a course
  getSessionsByCourse(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId: courseId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Optionally: delete or update session
  deleteSession(id) {
    this.db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) console.log("Delete error:", err);
    });
  }
}

const sessionDAO = new ClassModel('./database/classSessions.db');
module.exports = sessionDAO;
