var FirebaseQuestionsModule = (function () {

    var db;

    // ============================================================================================
    // public functions

    function init() {

        db = firebase.database();  // get a reference to the database service
    };

    // ============================================================================================
    // public interface

    return {
        init: init,
    };
})();
