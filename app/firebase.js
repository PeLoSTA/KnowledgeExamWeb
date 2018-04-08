var FirebaseModule = (function () {

    // reference to firebase database service
    var db;

    function init() {
        // get a reference to the database service
        db = firebase.database();
    };

    function readListOfSubjects(callback) {
        'use strict';
        var refString = '/subjects';
        db.ref(refString).once('value').then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                console.log("Got subject " + snap.name + ", Description = " + snap.description);
                callback({ name: snap.name, description: snap.description });
            });
        });
    }

    function addSubject(name, description) {

        'use strict';
        var refString = '/subjects';
        var newSubjectRef = db.ref(refString).push();
        newSubjectRef.set({ "name": name, "description": description });
    }

    return {
        init: init,
        addSubject: addSubject,
        readListOfSubjects: readListOfSubjects
    };
})();