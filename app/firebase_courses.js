/*global firebase */

var FirebaseCoursesModule = (function () {

    // firebase
    const refCourses = '/courses';
    var database;

    // (last read) list of courses
    var coursesList;

    // ============================================================================================
    // public functions

    function init() {
        'use strict';
        database = firebase.database();  // get a reference to the database service
        coursesList = [];                // empty list of courses
    }

    function getCourses() {
        'use strict';
        return database.ref(refCourses).once('value')
            .then((snapshot) => {
                coursesList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let course = {
                        name: snap.name,
                        description: snap.description,
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Course " + course.name + ", Description = " + course.description + ", Key = " + course.key);
                    coursesList.push(course);
                    localList.push(course);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseCoursesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of courses failed! [' + msg + ']');
                throw err;
            });
    }

    function addCourse(name, description) {
        'use strict';
        var key = '';

        return database.ref(refCourses).push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set({ name: name, description: description });
            })
            .then(() => {
                return key;
            })
            .catch((err) => {
                let msg = "FirebaseCoursesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] addCourse failed! ' + msg);
                throw msg;
            });
    }

    function updateCourse(course) {
        'use strict';
        var refString = refCourses + '/' + course.key;

        return database.ref(refString).update({ name: course.name, description: course.description })
            .then(() => {
                console.log('[Fire] updateCourse done !!! ');
            })
            .catch((err) => {
                let msg = "FirebaseCoursesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] updateCourse failed! ' + msg);
                throw msg;
            });
    }

    function deleteCourse(name) {
        'use strict';

        // search course to delete
        var refDeleteString = '';
        var keyOfCourse = '';
        for (var k = 0; k < coursesList.length; k++) {

            if (coursesList[k].name === name) {

                keyOfCourse = coursesList[k].key;
                refDeleteString = refCourses + '/' + keyOfCourse;
                break;
            }
        }
        if (refDeleteString === '') {
            let msg = "FirebaseCoursesModule: INTERNAL ERROR: course " + name + " not found!";
            console.log('[Fire] deleteCourse failed! ' + msg);
            return Promise.reject(msg);
        }

        return database.ref(refDeleteString).remove().then(() => {
            return keyOfCourse;
        }).catch((err) => {
            let msg = "FirebaseCoursesModule: ERROR " + err.code + ", Message: " + err.message;
            console.log('[Fire] deleteCourse failed! ' + msg);
            throw msg;
        });
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

        return '';
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addCourse: addCourse,
        updateCourse: updateCourse,
        deleteCourse: deleteCourse,

        getCourses: getCourses,
        getNameOfCourse: getNameOfCourse,
        getCourse: getCourse
    };
})();
