/*global firebase */

var FirebaseExamsModule = (function () {

    // firebase
    const refCourses = '/exams';
    var database;

    // ============================================================================================
    // public functions

    function init() {
        'use strict';
        database = firebase.database();  // get a reference to the database service
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    };
})();
