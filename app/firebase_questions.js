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

    // function readXXXXX() {
    //     'use strict';
    //     var refString = '/questions';
    //     db.ref(refString).orderByChild('subject').equalTo('-LAbK5Q3YCjl_IRRi3O0').once('value').then((snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             var snap = childSnapshot.val();
    //             var question = readQuestion(snap);
    //             callback(counter, question);
    //             counter++;
    //         });
    //     });
    // }

    function readListOfQuestionsFromSubject(subjectKey, callback, done) {
        'use strict';
        var refString = '/questions';
        db.ref(refString).orderByChild('subject').equalTo(subjectKey).once('value').then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var snap = childSnapshot.val();
                var question = readQuestion(snap);
                callback(counter, question);
                counter++;
            });
            done();
        });
    }

    function readListOfQuestions(callback, done) {
        'use strict';
        console.log("asdasdasdasdsadsada");
        questionsList = [];
        var refString = '/questions';
        var counter = 1;
        db.ref(refString).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                var question = readQuestion(snap);
                callback(counter, question);
                counter++;
            });
            done();
        });
    }

    function addQuestion(text, subjectKey, answers, correctAnswers) {
        'use strict';

        // build JSON object
        var question = {};
        question['/question'] = text;
        question['/subject'] = subjectKey;
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

    // ============================================================================================
    // private helper functions

    function readQuestion(snapshot) {
        'use strict';

        var question = {};
        var numAnswers = parseInt(snapshot['num-answers']);
        question['question'] = snapshot['question'];
        question['num-answers'] = numAnswers;
        question['num-correct-answers'] = parseInt(snapshot['num-correct-answers']);

        var answers = snapshot['answers'];
        question['answers'] = [];
        for (var k = 0; k < numAnswers; k++) {
            question['answers'].push(answers['answer' + (k + 1)]);
        }

        var correctAnswers = snapshot['correct-answers'];
        question['correct-answers'] = [];
        for (var k = 0; k < numAnswers; k++) {
            question['correct-answers'].push(correctAnswers['answer' + (k + 1)]);
        }

        // NEU
        // TODO: Im Firebase question JSON Object sollte das subject besser subject-key heißen 
        question['subject-key'] = snapshot['subject'];

        return question;
    }

    // ============================================================================================
    // public functions

    return {
        init: init,
        readListOfQuestions: readListOfQuestions,
        readListOfQuestionsFromSubject: readListOfQuestionsFromSubject,
        addQuestion: addQuestion
    };
})();
