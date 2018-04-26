var FirebaseSubjectsModule = (function () {

    var db;
    var subjectsList;

    // ============================================================================================
    // public functions

    function init() {

        db = firebase.database();  // get a reference to the database service
        subjectsList = [];         // empty list of subjects
    };

    function readListOfSubjects(callback, done) {
        'use strict';
        subjectsList = [];
        var refString = '/subjects';
        db.ref(refString).once('value').then(function (snapshot) {
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

    function readListOfSubjects_P() {
        'use strict';
        return new Promise(function (resolve, reject) {
            let list = [];
            var refString = '/subjects';

            db.ref(refString).once('value').then(function (snapshot) {

                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    console.log("Got subject " + snap.name + ", Description = " + snap.description);
                    var subject = { name: snap.name, description: snap.description, key: childSnapshot.key };
                    list.push(subject);
                });

                resolve(list);
            }).catch(function () {
                console.log('Reading list of subjects failed !!!');
                reject([]);
            });
        });
    }

    function addSubject(name, description) {
        'use strict';
        var refString = '/subjects';
        var ref = db.ref(refString).push();
        return ref.set({ "name": name, "description": description });
    }

    function updateSubject(subject) {
        'use strict';
        var refString = '/subjects/' + subject.key;
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
        readListOfSubjects: readListOfSubjects,
        getNameOfSubject: getNameOfSubject,
        getSubject: getSubject,

        readListOfSubjects_P: readListOfSubjects_P
    };
})();
