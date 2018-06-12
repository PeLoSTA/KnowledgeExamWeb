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

    // DAS IST VERALTET _-- KEINE PROMISES

    function readListOfQuestionsFromSubject(subjectKey, callback, done) {
        'use strict';

        console.log("===========> readListOfQuestionsFromSubject");

        questionsList = [];
        var refString = '/questions';
        var counter = 1;
        database.ref(refString).orderByChild('subject').equalTo(subjectKey).once('value').then((snapshot) => {
            snapshot.forEach((childSnapshot) => {

                console.log("===========> X1");
                var snap = childSnapshot.val();

                console.log("===========> X2");
                var question = readQuestion(snap);

                console.log("===========> X3");
                callback(counter, question);

                console.log("===========> X4");
                counter++;
            });
            done();
        });
    }

    function readListOfQuestions(callback, done) {
        'use strict';
        questionsList = [];
        var refString = '/questions';
        var counter = 1;
        database.ref(refString).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var snap = childSnapshot.val();
                var question = readQuestion(snap);
                callback(counter, question);
                counter++;
            });
            done();
        });
    }

    // ============================================================================================
    // NEU - based on Promise

    function addQuestion(text, courseKey, answers, correctAnswers) {
        'use strict';

        // build JSON object
        var question = {};
        question['/question'] = text;

        // TODO: course in courseKey umbenennen !!!
        // TODo 2: dann muss man auch bei den Regeln eine Index-Umnbenennung vornehmen !!!

        question['/course-key'] = courseKey;
        question['/num-answers'] = answers.length;

        for (var i = 0; i < answers.length; i++) {
            question['/answers/answer' + (i + 1)] = answers[i];
        }

        var numCorrectAnswers = 0;
        for (i = 0; i < correctAnswers.length; i++) {
            if (correctAnswers[i] === true) {
                numCorrectAnswers++;
                question['/correct-answers/answer' + (i + 1)] = true;
            } else {
                question['/correct-answers/answer' + (i + 1)] = false;
            }
        }

        question['/num-correct-answers'] = numCorrectAnswers;

        // write data into firebase
        var ref = database.ref(refQuestions).push();
        return ref.update(question);
    }

    // ============================================================================================
    // NEU - based on Promise

    function getQuestions() {
        'use strict';
        return database.ref(refQuestions).once('value')
            .then((snapshot) => {
                questionsList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    // let classs = {
                    //     name: snap.name,
                    //     description: snap.description,
                    //     key: childSnapshot.key
                    // };

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

                    console.log("[Fire] -> Question Text: " + snap.question + ", NumAnswers = " + snap['num-answers']);
                    questionsList.push(question);
                    localList.push(question);
                });
                console.log("[Fire] -> being here?!?!?!?!");
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
        readListOfQuestions: readListOfQuestions,
        readListOfQuestionsFromSubject: readListOfQuestionsFromSubject,
        addQuestion: addQuestion,

        getQuestions: getQuestions,
        getQuestionsOfCourse: getQuestionsOfCourse
    };
})();
