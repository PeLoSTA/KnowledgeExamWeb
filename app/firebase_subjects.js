var FirebaseSubjectsModule = (function () {

    // firebase
    const refSubjects = '/subjects';
    var database;

    // (last read) list of subjects
    var subjectsList;

    // ============================================================================================
    // public functions

    function init() {

        database = firebase.database();  // get a reference to the database service
        subjectsList = [];               // empty list of subjects
    };

    function readListOfSubjectsCb(callback, done) {
        'use strict';
        subjectsList = [];
        database.ref(refSubjects).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                console.log("Got subject " + snap.name + ", Description = " + snap.description);
                var subject = { name: snap.name, description: snap.description, key: childSnapshot.key };
                subjectsList.push(subject);
                callback(subject);
            });
            done();
        });
    }

    function readListOfSubjectsPr() {
        'use strict';
        return database.ref(refSubjects).once('value')
            .then((snapshot) => {
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    console.log("Got subject " + snap.name + ", Description = " + snap.description);
                    let subject = { name: snap.name, description: snap.description, key: childSnapshot.key };
                    localList.push(subject);
                    subjectsList.push(subject);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseSubjectsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of subjects failed! [' + msg + ']');
                throw err;
            });
    }

    // NOCH NICHT UMGESTELLT :::::::::::::::::.

    function addSubject(name, description) {
        'use strict';
        var ref = db.ref(refSubjects).push();
        return ref.set({ "name": name, "description": description });
    }

    function updateSubject(subject) {
        'use strict';
        var refString = refSubjects + '/' + subject.key;
        var ref = db.ref(refString);
        return ref.update({ "name": subject.name, "description": subject.description });
    }

    function deleteSubject(name) {
        'use strict';
        for (var k = 0; k < subjectsList.length; k++) {

            if (subjectsList[k].name === name) {

                var refDeleteString = '/subjects/' + subjectsList[k].key;
                db.ref(refDeleteString).remove(function (error) {
                    console.log(error ? "Deletion failed !!!" : "Success!");
                });
                break;
            }
        }
    }

    function getSubject(index) {
        'use strict';
        if (index < 0 || index >= subjectsList.length) {
            return null;
        }

        return subjectsList[index];
    }

    function getNameOfSubject(key) {
        'use strict';
        for (var k = 0; k < subjectsList.length; k++) {

            if (subjectsList[k].key === key) {
                return subjectsList[k].name;
            }
        }

        return "";
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addSubject: addSubject,
        updateSubject: updateSubject,
        deleteSubject: deleteSubject,
        getNameOfSubject: getNameOfSubject,
        getSubject: getSubject,

        readListOfSubjectsCb: readListOfSubjectsCb,
        readListOfSubjectsPr: readListOfSubjectsPr
    };
})();
