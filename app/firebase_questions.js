var FirebaseQuestionsModule = (function () {

    var db;
    var questionsList;

    // ============================================================================================
    // public functions

    function init() {

        db = firebase.database();  // get a reference to the database service
    };

    // ============================================================================================
    // public interface

    function readListOfQuestions(callback, done) {
        'use strict';
        questionsList = [];
        var refString = '/questions';
        var counter = 1;
        db.ref(refString).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();

                var question = {};
                var numAnswers = parseInt(snap['num-answers']);
                question['question'] = snap['question'];
                question['num-answers'] = numAnswers;
                question['num-correct-answers'] = parseInt(snap['num-correct-answers']);

                var answers = snap['answers'];
                question['answers'] = [];
                for (var k = 0; k < numAnswers; k++) {
                    question['answers'].push(answers['answer' + (k + 1)]);
                }

                var correctAnswers = snap['correct-answers'];
                question['correct-answers'] = [];
                for (var k = 0; k < numAnswers; k++) {
                    question['correct-answers'].push(correctAnswers['answer' + (k + 1)]);
                }

                callback(counter, question);
                counter++;
            });
            done();
        });
    }

    function addQuestion(text, answers, correctAnswers) {
        'use strict';

        // build JSON object
        var question = {};
        question['/question'] = text;
        question['/num-answers'] = answers.length;

        for (var i = 0; i < answers.length; i++) {
            question['/answers/answer' + (i + 1)] = answers[i];
        }

        var numCorrectAnswers = 0;
        for (var i = 0; i < correctAnswers.length; i++) {
            if (correctAnswers[i] === true) {
                numCorrectAnswers++;
                question['/correct-answers/answer' + (i + 1)] = true;
            } else {
                question['/correct-answers/answer' + (i + 1)] = false;
            }
        }

        question['/num-correct-answers'] = numCorrectAnswers;

        // write data into firebase
        var ref = db.ref('questions').push();
        return ref.update(question);
    }

    return {
        init: init,
        readListOfQuestions: readListOfQuestions,
        addQuestion: addQuestion
    };
})();
