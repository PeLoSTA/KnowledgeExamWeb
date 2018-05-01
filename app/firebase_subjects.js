var FirebaseCoursesModule = (function () {

    // firebase
    const refCourses = '/subjects';  // ??????????????? TBD: Das sollten jetzt auch courses sein ....
    var database;

    // (last read) list of courses
    var coursesList;

    // ============================================================================================
    // public functions

    function init() {

        database = firebase.database();  // get a reference to the database service
        coursesList = [];               // empty list of courses
    };

    function readListOfCoursesCb(callback, done) {
        'use strict';
        coursesList = [];
        database.ref(refCourses).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                console.log("Got course " + snap.name + ", Description = " + snap.description);
                var course = { name: snap.name, description: snap.description, key: childSnapshot.key };
                coursesList.push(course);
                callback(course);
            });
            done();
        });
    }

    function readListOfCoursesPr() {
        'use strict';
        return database.ref(refCourses).once('value')
            .then((snapshot) => {
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    console.log("Got course " + snap.name + ", Description = " + snap.description);
                    let course = { name: snap.name, description: snap.description, key: childSnapshot.key };
                    localList.push(course);
                    coursesList.push(course);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseCoursesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of courses failed! [' + msg + ']');
                throw err;
            });
    }

    // NOCH NICHT UMGESTELLT :::::::::::::::::.

    function addCourse(name, description) {
        'use strict';
        var ref = db.ref(refCourses).push();
        return ref.set({ "name": name, "description": description });
    }

    function updateCourse(course) {
        'use strict';
        var refString = refCourses + '/' + course.key;
        var ref = db.ref(refString);
        return ref.update({ "name": course.name, "description": course.description });
    }

    function deleteCourse(name) {
        'use strict';
        for (var k = 0; k < coursesList.length; k++) {

            if (coursesList[k].name === name) {

                var refDeleteString = refCourses + '/' + coursesList[k].key;
                db.ref(refDeleteString).remove(function (error) {
                    console.log(error ? "Deletion failed !!!" : "Success!");
                });
                break;
            }
        }
    }

    function getCourse(index) {
        'use strict';
        if (index < 0 || index >= coursesList.length) {
            return null;
        }

        return coursesList[index];
    }

    function getNameOfCourse(key) {
        'use strict';
        for (var k = 0; k < coursesList.length; k++) {

            if (coursesList[k].key === key) {
                return coursesList[k].name;
            }
        }

        return "";
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addCourse: addCourse,
        updateCourse: updateCourse,
        deleteCourse: deleteCourse,
        getNameOfCourse: getNameOfCourse,
        getCourse: getCourse,

        readListOfCoursesCb: readListOfCoursesCb,
        readListOfCoursesPr: readListOfCoursesPr
    };
})();
