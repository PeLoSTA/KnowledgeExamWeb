/*global firebase */

var FirebaseStudentsModule = (function () {

    const refStudents = '/students';

    // firebase database reference
    var database;

    // ============================================================================================
    // initialization

    function init() {

        database = firebase.database();  // get a reference to the database service
    }

    // ============================================================================================
    // public functions

    function addStudent(firstname, lastname, subject) {
        'use strict';

        return new Promise(function (resolve, reject) {

            console.log('aaa');

            let newRef = database.ref(refStudents).push();

            console.log('bbb');

            if (newRef) {
                console.log('ccc');
                newRef.set({ name: "Ooopsi" });  // ??? uncaught !?!?!?!?
                resolve(newRef.key);
            }
            else {
                console.log('eee');
                reject("addStudent ==> firebase push operation failed!");
            }
        });
    }

    function addStudent2(firstname, lastname, subject) {
        'use strict';

        let student = { firstname: firstname, lastname: lastname, subject: subject };
        let key = '';

        return database.ref(refStudents).push()
            .then((newRef) => {
                console.log('111');
                key = newRef.key;
                return newRef.set(student);
            })
            .then(() => {
                console.log('222');
                console.log("success");
                return key;
            })
            .catch(function (err) {
                console.log('333');

                let msg = "Error " + err.code + ", Message: " + err.message;

                console.log('err', msg);
                key = 'weiß nicht ....';
                throw err;
            });
    }

    function addStudent3(firstname, lastname, subject) {
        'use strict';

        return new Promise(function (resolve, reject) {

            console.log('xxx');

            let student = { firstname: firstname, lastname: lastname, subject: subject };
            let key = '';

            return database.ref(refStudents).push()
                .then((newRef) => {
                    console.log('yyy');
                    key = newRef.key;
                    return newRef.set(student);
                })
                .then(() => {
                    console.log('uuu');
                    resolve(key);
                })
                .catch(function (err) {
                    console.log('vvv');
                    reject(err);
                });
        });
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addStudent: addStudent,
        addStudent2: addStudent2,
        addStudent3: addStudent3
    }
})();
