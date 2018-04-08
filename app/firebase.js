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

    return {
        init: init,
        readListOfSubjects: readListOfSubjects
    };

})();