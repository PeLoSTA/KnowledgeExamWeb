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

    function addStudent(firstname, lastname, email, classs) {
        'use strict';
        var key = '';

        return database.ref(refStudents).push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set({ firstname: firstname, lastname: lastname, email: email, 'class': classs });
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
                        key: snap.class
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", Key = " + student.key);
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

    function getStudents(classs) {
        'use strict';
        return database.ref(refStudents).orderByChild('class').equalTo(classs).once('value')
            .then((snapshot) => {
                studentsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let student = {
                        firstname: snap.firstname,
                        lastname: snap.lastname,
                        email: snap.email,
                        key: snap.class
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", Key = " + student.key);
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

    // ============================================================================================
    // public interface

    return {
        init: init,
        addStudent: addStudent,

        getStudents: getStudents,
        getAllStudents: getAllStudents
    }
})();
