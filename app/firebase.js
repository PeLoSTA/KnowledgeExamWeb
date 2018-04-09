var FirebaseModule = (function () {

    var db;
    var subjectsList;

    function init() {

        db = firebase.database();  // get a reference to the database service
        subjectsList = [];         // empty list of subjects
    };

    function readListOfSubjects(callback) {
        'use strict';
        subjectsList = [];
        var refString = '/subjects';
        db.ref(refString).once('value').then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                console.log("Got subject " + snap.name + ", Description = " + snap.description);
                var subject = { name: snap.name, description: snap.description };
                subjectsList.push(subject);
                callback(subject);
            });
        });
    }

    function addSubject(name, description) {
        'use strict';
        var refString = '/subjects';
        var newSubjectRef = db.ref(refString).push();
        newSubjectRef.set({ "name": name, "description": description });
    }

    function getSubjectName(index) {
        'use strict';
        if (index < 0 || index >= subjectsList.length) {
            return "";
        }

        return subjectsList[index].name;
    }

    return {
        init: init,
        addSubject: addSubject,
        readListOfSubjects: readListOfSubjects,
        getSubjectName: getSubjectName
    };
})();