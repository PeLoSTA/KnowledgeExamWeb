var FirebaseStudentsModule = (function () {

    var db;

    // ============================================================================================
    // public functions

    function init() {

        db = firebase.database();  // get a reference to the database service
    };

    function addStudent(firstname, lastname, subject) {
        'use strict';
        var refString = '/subjects';
        var ref = db.ref(refString).push();
        return ref.set({ "name": name, "description": description });
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
    };
})();
