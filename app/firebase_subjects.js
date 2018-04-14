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

    function addSubject(name, description) {
        'use strict';
        var refString = '/subjects';
        var ref = db.ref(refString).push();
        ref.set({ "name": name, "description": description });
    }

    function updateSubject(subject) {
        'use strict';
        var refString = '/subjects/' + subject.key;
        var ref = db.ref(refString);
        ref.update({ "name": subject.name, "description": subject.description });
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

    // ============================================================================================
    // public interface

    return {
        init: init,
        addSubject: addSubject,
        updateSubject: updateSubject,
        deleteSubject: deleteSubject,
        readListOfSubjects: readListOfSubjects,
        getSubject: getSubject
    };
})();
