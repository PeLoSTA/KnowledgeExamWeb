/*global firebase */

var FirebaseQuestionsModule = (function () {

    const refQuestions = '/questions';
    var database;
    var questionsList;

    // ============================================================================================
    // public functions

    function init() {
        'use strict';
        database = firebase.database();  // get a reference to the database service
    }

    // ============================================================================================
    // public interface

    function addQuestion(text, courseKey, answers, correctAnswers) {
        'use strict';

        // build JSON object - set elementary properties
        var question = {};
        question['question'] = text;
        question['course-key'] = courseKey;
        question['num-answers'] = answers.length;

        // create answers - nested properties
        var data = {};
        for (var i = 0; i < answers.length; i++) {
            data['answer' + (i + 1)] = answers[i];
        }
        question['answers'] = data;

        // create answer results - nested properties
        var results = {};
        var numCorrectAnswers = 0;
        for (i = 0; i < correctAnswers.length; i++) {
            if (correctAnswers[i] === true) {
                numCorrectAnswers++;
                results['answer' + (i+1)] = true;
            } else {
                results['answer' + (i+1)] = false;
            }
        }
        question['correct-answers'] = results;
        question['num-correct-answers'] = numCorrectAnswers;

        // write data into firebase
        var ref = database.ref(refQuestions).push();
        return ref.set(question);
    }

    // ============================================================================================
    // public functions

    function getQuestions() {
        'use strict';
        return database.ref(refQuestions).once('value')
            .then((snapshot) => {
                questionsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    var question = readQuestion(snap);
                    console.log("[Fire] -> Question Text: " + snap.question + ", NumAnswers = " + snap['num-answers']);
                    questionsList.push(question);
                    localList.push(question);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseQuestionsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] getQuestions failed! ' + msg);
                throw msg;
            });
    }

    function getQuestionsOfCourse(courseKey) {
        'use strict';
        return database.ref(refQuestions).orderByChild('course-key').equalTo(courseKey).once('value')
            .then((snapshot) => {
                questionsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    var question = readQuestion(snap);

                    // question['key'] = snapshot['key'];   childSnapshot.key
                    question['key'] = childSnapshot.key

                    console.log("[Fire] -> Question Text: " + snap.question + ", NumAnswers = " + snap['num-answers']);
                    questionsList.push(question);
                    localList.push(question);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseQuestionsModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] getQuestionTexts failed! ' + msg);
                throw msg;
            });
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
        for (k = 0; k < numAnswers; k++) {
            question['correct-answers'].push(correctAnswers['answer' + (k + 1)]);
        }

        question['course-key'] = snapshot['course-key'];

        return question;
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        addQuestion: addQuestion,
        
        getQuestions: getQuestions,
        getQuestionsOfCourse: getQuestionsOfCourse
    };
})();
