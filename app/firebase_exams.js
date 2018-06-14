/*global firebase */

var FirebaseExamsModule = (function () {

    // firebase
    const refExams = '/exams';
    var database;

    // ============================================================================================
    // public functions

    function init() {
        'use strict';
        database = firebase.database();  // get a reference to the database service
    }

    // ============================================================================================
    // public interface

    function addExam(description, pin, questions) {
        'use strict';

        // build JSON object - set elementary properties
        var exam = {};
        exam['description'] = description;
        exam['pin'] = pin;
        exam['num-questions'] = questions.length;

        // create list of questions - nested object with several distinct properties
        var data = {};
        for (var i = 0; i < questions.length; i++) {
            data['question' + (i + 1)] = questions[i];
        }
        exam['questions'] = data;

        // write data into firebase
        var key = '';
        return database.ref(refExams).push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set(exam);
            })
            .then(() => {
                return key;
            })
            .catch((err) => {
                let msg = "FirebaseExamsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] addExam failed! ' + msg);
                throw msg;
            });
    }

    // ============================================================================================
    // private helper functions

    return {
        init: init,
        addExam: addExam
    };
})();
