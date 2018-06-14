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
        'use strict';
        database = firebase.database();  // get a reference to the database service
        studentsList = [];               // empty list of students
    }

    // ============================================================================================
    // public functions

    function addStudent(firstname, lastname, email, keyClass) {
        'use strict';
        var key = '';

        return database.ref(refStudents)
            .push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    'key-class': keyClass
                });
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

        return database.ref(refString)
            .update({
                firstname: student.firstname,
                lastname: student.lastname,
                email: student.email,
                'key-class': student['key-class']
            })
            .then(() => {
                console.log('[Fire] updateStudent done !!! ');
            })
            .catch((err) => {
                let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] updateStudent failed! ' + msg);
                throw msg;
            });
    }

    function deleteStudent(index) {
        'use strict';

        // retrieve key of student to delete
        var key = studentsList[index].key;
        var refDelete = refStudents + '/' + key;

        return database.ref(refDelete).remove().then(() => {
            return key;
        }).catch((err) => {
            let msg = "FirebaseStudentsModule: ERROR " + err.code + ", Message: " + err.message;
            console.log('[Fire] deleteStudent failed! ' + msg);
            throw msg;
        });
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
        return database.ref(refStudents)
            .once('value')
            .then((snapshot) => {
                studentsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let student = {
                        firstname: snap.firstname,
                        lastname: snap.lastname,
                        email: snap.email,
                        'key-class': snap['key-class'],
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", key-class = " + student['key-class']);
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
        return database.ref(refStudents)
            .orderByChild('key-class')
            .equalTo(keyClass)
            .once('value')
            .then((snapshot) => {
                studentsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let student = {
                        firstname: snap.firstname,
                        lastname: snap.lastname,
                        email: snap.email,
                        'key-class': snap['key-class'],
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Student " + student.firstname + ' ' + student.lastname + ", EMail = " + student.email + ", key-class = " + student['key-class']);
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
