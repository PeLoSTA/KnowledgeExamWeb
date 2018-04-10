var FirebaseModule = (function () {

    var db;
    var subjectsList;

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

    // function readListOfSubjects2(callback) {
    //     'use strict';
    //     subjectsList = [];
    //     var refString = '/subjects';
    //     db.ref(refString).on('value', function (snapshot) {
    //         snapshot.forEach(function (childSnapshot) {
    //             var snap = childSnapshot.val();
    //             console.log("Got subject " + snap.name + ", Description = " + snap.description);
    //             var subject = { name: snap.name, description: snap.description, key: childSnapshot.key };
    //             subjectsList.push(subject);
    //             callback(subject);
    //         });
    //     });
    // }

    function addSubject(name, description) {
        'use strict';
        var refString = '/subjects';
        var newSubjectRef = db.ref(refString).push();
        newSubjectRef.set({ "name": name, "description": description });
    }

    function deleteSubject(name) {
        'use strict';
        console.log("deleteSubject: TDB");

        for (var k = 0; k < subjectsList.length; k++) {
            if (subjectsList[k].name === name) {

                console.log("FOUND item to delete: " + subjectsList[k].key);

                var refDeleteString = '/subjects/' + subjectsList[k].key;
                db.ref(refDeleteString).remove(function (error) {
                    console.log(error ? "Deletion failed !!!" : "Success!");
                });

                break;
            }
        }
    }

    function getNameOfSubject(index) {
        'use strict';
        if (index < 0 || index >= subjectsList.length) {
            return "";
        }

        return subjectsList[index].name;
    }

    return {
        init: init,
        addSubject: addSubject,
        deleteSubject: deleteSubject,
        readListOfSubjects: readListOfSubjects,
        getNameOfSubject: getNameOfSubject
    };
})();
