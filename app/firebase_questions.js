var FirebaseQuestionsModule = (function () {

    var db;

    // ============================================================================================
    // public functions

    function init() {

        db = firebase.database();  // get a reference to the database service
    };

    // ============================================================================================
    // public interface

    function addQuestion(question, answers, correctAnswers) {
        'use strict';
        var ref = db.ref('questions').push();
        ref.set({ "question": question, "num-answers": answers.length });

        var refAnswers = ref.child('answers').push();
        for (var i = 0; i < answers.length; i++) {
            refAnswers.child('answer' + (i + 1)).set(answers[i]);
        }

        var refCorrect = ref.child('correct-answers').push();
        var numCorrectAnswers = 0;
        for (var i = 0; i < correctAnswers.length; i++) {

            // TODO: das lässt sich mit dem ?: kompakter schreiben ....
            if (correctAnswers[i] === true) {
                numCorrectAnswers++;
                refCorrect.child('answer' + (i + 1)).set(true);
            } else {
                refCorrect.child('answer' + (i + 1)).set(false);
            }
        }

        ref.child('num-correct-answers').set(numCorrectAnswers);
    }

    return {
        init: init,
        addQuestion: addQuestion
    };
})();
