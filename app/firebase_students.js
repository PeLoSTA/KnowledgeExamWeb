/*global firebase */

var FirebaseStudentsModule = (function () {

    const refStudents = '/students';

    // firebase database reference
    var database;

    // (last read) list of students
    var studentsList;

    // ============================================================================================
    // initialization

    function init() {

        database = firebase.database();  // get a reference to the database service
        studentsList = [];               // empty list of students
    }

    // ============================================================================================
    // public functions

    function addStudent(firstname, lastname, email, keyClass) {
        'use strict';
        var key = '';

        return database.ref(refStudents).push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set({ firstname: firstname, lastname: lastname, email: email, keyClass: keyClass });
            })
            .then(() => {
                return key;
            })
            .catch((err) => {
                let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] addStudent failed! ' + msg);
                throw msg;
            });
    }

    function updateStudent(student) {
        'use strict';
        var refString = refStudents + '/' + student.key;

        return database.ref(refString).update({ firstname: student.firstname, lastname: student.lastname, email: student.email, keyClass: student.keyClass })
            .then(() => {
                console.log('[Fire] updateStudent done !!! ');
            })
            .catch((err) => {
                let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] updateStudent failed! ' + msg);
                throw msg;
            });
    }

    function deleteStudent() {
        'use strict';
    }

    function getStudents(keyClass) {
        if (keyClass === undefined) {
            return getAllStudents();
        }
        else {
            return getStudentsOfClass(keyClass);
        }
    }

    function getAllStudents() {
        'use strict';
        return database.ref(refStudents).once('value')
            .then((snapshot) => {
                studentsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let student = {
                        firstname: snap.firstname,
                        lastname: snap.lastname,
                        email: snap.email,
                        keyClass: snap.keyClass,
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", keyClass = " + student.keyClass);
                    studentsList.push(student);
                    localList.push(student);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of students failed! [' + msg + ']');
                throw err;
            });
    }

    function getStudentsOfClass(keyClass) {
        'use strict';
        return database.ref(refStudents).orderByChild('keyClass').equalTo(keyClass).once('value')
            .then((snapshot) => {
                studentsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let student = {
                        firstname: snap.firstname,
                        lastname: snap.lastname,
                        email: snap.email,
                        keyClass: snap.keyClass,
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", keyClass = " + student.keyClass);
                    studentsList.push(student);
                    localList.push(student);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of students failed! [' + msg + ']');
                throw err;
            });
    }

    function getStudent(index) {
        'use strict';
        if (index < 0 || index >= studentsList.length) {
            return null;
        }

        return studentsList[index];
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addStudent: addStudent,
        updateStudent: updateStudent,
        deleteStudent: deleteStudent,
        getStudent: getStudent,
        getStudents: getStudents
    }
})();
