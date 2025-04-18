const Datastore = require('gray-nedb');

class CourseDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      this.db = new Datastore();
    }
  }

  addCourse(course) {
    this.db.insert(course, (err, doc) => {
      if (err) {
        console.log('Error adding course:', err);
      } else {
        console.log('Course added:', doc);
      }
    });
  }

  getAllCourses() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  getCourseById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  deleteCourse(id) {
    this.db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) console.log('Delete error:', err);
    });
  }

  updateCourse(id, updatedData) {
    this.db.update({ _id: id }, { $set: updatedData }, {}, (err) => {
      if (err) console.log('Update error:', err);
    });
  }

  //  TEMP TEST DATA INSERTION FUNCTION
  initTestCourses() {
    this.db.count({}, (err, count) => {
      if (count === 0) {
        this.db.insert([
          {
            name: "Salsa for Beginners",
            duration: "6 weeks",
            description: "Learn the basics of Salsa dancing.",
            location: "Community Hall A",
            price: 60
          },
          {
            name: "Weekend Tango Intensive",
            duration: "2 days",
            description: "Master the Argentine Tango in a focused workshop.",
            location: "Studio B",
            price: 90
          }
        ], (err) => {
          if (!err) console.log("Sample courses added.");
        });
      }
    });
  }
}

const dao = new CourseDAO('./database/courses.db');
dao.initTestCourses(); // Only runs if database is empty
module.exports = dao;
