/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */

/*global MaterialRadio */
/*global MaterialCheckbox */

/*global dialogPolyfill */
/*global componentHandler */

var HtmlTabQuestionsViewerModule = (function () {

    // retrieve HTML elements according to 'questions viewer' tab
    var tabQuestionsSurvey = document.getElementById('#questions-panel-survey');

    var tableQuestionsBody = document.getElementById('tableQuestionsBody');
    var tableAnswersBody = document.getElementById('tableAnswersBody');

    var selectCourseQuestionsAdmin = document.getElementById('selectCourseQuestionsViewer');

    var txtStatusBar = document.getElementById('status_bar');

    // ============================================================================================
    // TESTING - TO BE REMOVED

    var btnXXXXX = document.getElementById('XXXXXXXXXXXXXX');
    btnXXXXX.addEventListener('click', onClickEventTEST);

    // GEHT !!!
    // function onClickEventTEST() {
    //     'use strict';
    //     return FirebaseQuestionsModule.getQuestions().then((listOfQuestions) => {
    //         for (var i = 0; i < listOfQuestions.length; i++) {
    //             var question = listOfQuestions[i];
    //             console.log("Question:");
    //             console.log("  Text: " + question.question);
    //             console.log("  NumAnswers: " + question['num-answers']);
    //         }
    //     }).catch((msg) => {
    //         // log error message to status line
    //         console.log(" ERROR");
    //     }).finally(() => {

    //         console.log("Success");
    //     });
    // }

    // GEHT
    // function onClickEventTEST() {
    //     'use strict';
    //     return FirebaseQuestionsModule.getQuestionTexts().then((listOfQuestions) => {

    //     }).catch((msg) => {
    //         // log error message to status line
    //         console.log(" ERROR");
    //     }).finally(() => {

    //         console.log("Success");
    //     });
    // }

    function onClickEventTEST() {
        'use strict';
        return FirebaseQuestionsModule.getQuestionTextsOfCourse('bla').then((listOfQuestions) => {
            console.log(" Found quesions: " + listOfQuestions.length);
        }).catch((msg) => {
            // log error message to status line
            console.log(" ERROR");
        }).finally(() => {

            console.log("Success");
        });
    }

    // ============================================================================================
    // initialization

    // miscellaneous data
    // var currentSubject;   // needed to assign question input to this subject (survey)  // TODO : Wird das noch gebraucht ????

    // TODO : Geht das nicht ohne diese Variable !!!

    // TODO: BISLANG BESTEHT BEIM VIEWER KEINE NOTWENDIGKEIT, Kurse und Fragen in globalen Listen abzuspeichern !!!


    var rowCounter;       // needed to create unique id for each table row

    var coursesSelectedIndex;   // needed to assign question input to this course (admin)
    var courses;                // list of courses

    // ============================================================================================
    // initialization

    function init() {
        // questions
        // currentSubject = null;

        // connect ui elements with event handlers
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        tabQuestionsSurvey.addEventListener('click', () => {
            'use strict';
            onLoadCourses();
            onLoadQuestionsEx();
        });

        selectCourseQuestionsAdmin.addEventListener('change', onChangeEvent);
    }

    // ============================================================================================
    // click event dispatching routine: select box

    function onChangeEvent() {
        'use strict';

        // retrieve index of selected item
        var start = 'option_'.length;
        var reminder = this.value.substr(start);

        // store currently selected class (index of this class) in closure
        coursesSelectedIndex = parseInt(reminder);

        console.log(coursesSelectedIndex);

        if (coursesSelectedIndex === 0) {
            onLoadQuestionsEx();
        }
        else {
            var course = courses[coursesSelectedIndex - 1];
            onLoadQuestionsOfCourseEx(course.key);
        }

        // var keyOfCourse = entry[''];
        // var nameOfSubject = FirebaseCoursesModule.getNameOfCourse(keyOfCourse);
    }

    // ============================================================================================
    // questions

    /*
     *  reading list of questions asynchronously - ALTE Version mit Callbacks
     */

    // function onLoadQuestionsSurvey() {
    //     'use strict';
    //     console.log("onLoadQuestionsSurvey");
    //     updateTableOfQuestions();
    // }

    // function updateTableOfQuestions() {
    //     'use strict';
    //     updateTableOfQuestionsBegin();
    //     FirebaseQuestionsModule.readListOfQuestions(updateTableOfQuestionsNext, updateTableOfQuestionsDone);
    // }

    // function updateTableOfQuestionsBegin() {
    //     'use strict';
    //     if (isActive === true) {
    //         console.log("Another asynchronous invocation still pending ... just ignoring click event!");
    //         return;
    //     }

    //     isActive = true;
    //     console.log("updateTableOfQuestionsBegin");
    //     rowCounter = 1;
    //     tableQuestionsBody.innerHTML = '';
    //     componentHandler.upgradeDom();
    // }

    // function updateTableOfQuestionsNext(counter, question) {
    //     'use strict';
    //     addEntryToQuestionsTable(counter, question);
    // }

    // function updateTableOfQuestionsDone() {
    //     'use strict';
    //     isActive = false;
    //     console.log('done................................');
    // }

    // ============================================================================================
    // questions

    /*
     *  reading list of questions asynchronously - NEU
     */

    function onLoadQuestionsEx() {
        'use strict';
        console.log("[Html] > onLoadQuestionsEx");

        tableQuestionsBody.innerHTML = '';
        return FirebaseQuestionsModule.getQuestions().then((listOfQuestions) => {
            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTableEx(tableQuestionsBody, i, question);
            }
            return listOfQuestions.length;
        }).then((number) => {
            // refresh status line
            txtStatusBar.value = number + ' questions.';
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            componentHandler.upgradeDom();
            console.log("[Html] < onLoadQuestionsEx");
        });
    }

    function onLoadQuestionsOfCourseEx(courseKey) {
        'use strict';
        console.log("[Html] > onLoadQuestionsOfCourseEx");

        tableQuestionsBody.innerHTML = '';
        return FirebaseQuestionsModule.getQuestionsOfCourse(courseKey).then((listOfQuestions) => {
            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTableEx(tableQuestionsBody, i, question);
            }
            return listOfQuestions.length;
        }).then((number) => {
            // refresh status line
            txtStatusBar.value = number + ' questions.';
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            componentHandler.upgradeDom();
            console.log("[Html] < onLoadQuestionsOfCourseEx");
        });
    }

    // ============================================================================================
    // private helper functions (viewer)

    // function addQuestionToTable(tablebody, counter, entry) {
    //     'use strict';

    //     console.log('addEntryToQuestionsTable .................');

    //     // adding dynamically a 'material design lite' node to a table, for example
    //     //
    //     // <tr>
    //     //     <td>Frage 1</td>
    //     //     <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
    //     //         Tables are a ubiquitous feature of most user interfaces, regardless of a ...
    //     //     </td>
    //     //     <td>Mathe</td>
    //     // </tr>
    //     //     <tr>
    //     //         <td>Anwort 1</td>
    //     //         <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
    //     //             Nein
    //     //         </td>
    //     //         <td>
    //     //             <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
    //     //                 <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
    //     //             </label>
    //     //         </td>
    //     //     </tr>

    //     // add single row for question itself

    //     var keyOfCourse = entry['course'];
    //     var nameOfSubject = FirebaseCoursesModule.getNameOfCourse(keyOfCourse);
    //     var node = createQuestion(counter, entry.question, nameOfSubject);
    //     tablebody.appendChild(node);

    //     // add rows for answers
    //     var numAnswers = entry['num-answers'];
    //     var numCorrectAnswers = entry['num-correct-answers'];
    //     var useRadioButton = (numCorrectAnswers === 1);

    //     for (var row = 0; row < numAnswers; row++) {

    //         var nodeAnswer = createAnswer(
    //             row,
    //             entry.answers[row],
    //             useRadioButton,
    //             entry['correct-answers'][row]
    //         );

    //         tablebody.appendChild(nodeAnswer);
    //     }
    //     componentHandler.upgradeDom();
    // }

    // ============================================================================================

    function addQuestionToTableEx(tablebody, counter, entry) {
        'use strict';

        console.log('addQuestionToTableEx .................');

        // adding dynamically a 'material design lite' node to a table, for example
        //
        // <tr>
        //     <td>Frage 1</td>
        //     <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
        //         Tables are a ubiquitous feature of most user interfaces, regardless of a ...
        //     </td>
        //     <td>Mathe</td>
        // </tr>

        // add single row for question

        var keyOfCourse = entry[''];
        var nameOfSubject = FirebaseCoursesModule.getNameOfCourse(keyOfCourse);
        var node = createQuestion(counter, entry.question, nameOfSubject);
        tablebody.appendChild(node);
    }

    // ============================================================================================
    // private helper functions (ui - questions table - viewer)

    function createQuestion(counter, text, name) {

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node

        td1.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td1.setAttribute('style', 'text-align:left;');  // set attribute

        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td2.setAttribute('style', 'text-align:left;');  // set attribute

        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('style', 'text-align:right;');  // set attribute

        var header = 'Frage ' + (counter + 1) + ':';
        var textnode1 = document.createTextNode(header); // create first text node
        var textnode2 = document.createTextNode(text);   // create second text node
        var textnode3 = document.createTextNode(name);   // create third text node

        td1.appendChild(textnode1);   // append text to <td>
        td2.appendChild(textnode2);   // append text to <td>
        td3.appendChild(textnode3);   // append text to <td>

        node.appendChild(td1);  // append <td> to <tr>
        node.appendChild(td2);  // append <td> to <tr>
        node.appendChild(td3);  // append <td> to <tr>

        return node;
    }

    function createAnswer(number, question_text, useRadioButton, isCorrect) {

        var nodeAnswer = document.createElement('tr');    // create <tr> node

        var td1Answer = document.createElement('td');     // create first <td> node
        var td2Answer = document.createElement('td');     // create second <td> node
        var td3Answer = document.createElement('td');     // create third <td> node

        td2Answer.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td2Answer.setAttribute('style', 'word-wrap: break-word;  white-space: normal;');  // set attribute

        var headerAnswer = 'Antwort ' + (number + 1) + ':';
        var textNodeAnswer1 = document.createTextNode(headerAnswer);  // create first text node
        var textnodeAnswer2 = document.createTextNode(question_text); // create second text node

        td1Answer.appendChild(textNodeAnswer1);   // append text to <td>
        td2Answer.appendChild(textnodeAnswer2);   // append text to <td>

        // create third node
        var label = (useRadioButton) ?
            createRadioButton(rowCounter, isCorrect) :
            createCheckBox(rowCounter, isCorrect);

        td3Answer.appendChild(label);       // append <label> to <td>
        rowCounter++;

        nodeAnswer.appendChild(td1Answer);  // append <td> to <tr>
        nodeAnswer.appendChild(td2Answer);  // append <td> to <tr>
        nodeAnswer.appendChild(td3Answer);  // append <td> to <tr>

        return nodeAnswer;
    }

    function createRadioButton(id, checked) {

        // <td>
        //     <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-data-table__select" for="row_1">
        //         <input type="checkbox" id="row_1" class="mdl-radio__button" />
        //     </label>
        // </td>

        'use strict';
        var label = document.createElement('label');  // create <label> node
        label.setAttribute('class', 'mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-data-table__select');
        label.setAttribute('for', 'row__' + id);  // set attribute

        var input = document.createElement('input');       // create <input> node
        input.setAttribute('class', 'mdl-radio__button');  // set attribute
        input.setAttribute('type', 'radio');     // set attribute
        input.setAttribute('id', 'row__' + id);  // set attribute

        label.appendChild(input);  // append <input> to <label>

        // https://stackoverflow.com/questions/31413042/toggle-material-design-lite-checkbox
        var mdlRadio = new MaterialRadio(label);
        (checked) ? mdlRadio.check() : mdlRadio.uncheck();
        // mdlRadio.check();
        mdlRadio.disable();

        return label;
    }

    function createCheckBox(id, checked) {

        // <td>
        //     <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //         <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //     </label>
        // </td>

        'use strict';
        var label = document.createElement('label');  // create <label> node
        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');
        label.setAttribute('for', 'row__' + id);   // set attribute

        var input = document.createElement('input');         // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input');  // set attribute
        input.setAttribute('type', 'checkbox');  // set attribute
        input.setAttribute('id', 'row__' + id);  // set attribute

        label.appendChild(input);  // append <input> to <label>

        // https://stackoverflow.com/questions/31413042/toggle-material-design-lite-checkbox
        var mdlCheckbox = new MaterialCheckbox(label);
        (checked) ? mdlCheckbox.check() : mdlCheckbox.uncheck();
        // mdlCheckbox.check();
        mdlCheckbox.disable();

        return label;
    }

    // ============================================================================================
    // private helper functions (ui - subjects menu - survey tab)  

    // TODO: RENAME Survey to Viewer !!!!

    // function onLoadListOfSubjectsSurvey() {
    //     'use strict';
    //     addMenuEntrySurvey({ name: 'Alle', description: '', key: '' });
    //     FirebaseSubjectsModule.readListOfSubjects(addMenuEntrySurvey, doneMenuSurvey);
    // }

    // function addMenuEntrySurvey(subject) {
    //     'use strict';

    //     // <li>
    //     //     <p class="mdl-menu__item">Subject</p>
    //     // </li>

    //     var listitem = document.createElement('li');   // create <li> node
    //     var para = document.createElement('p');        // create <p> node
    //     para.setAttribute('class', 'mdl-menu__item');  // set attribute
    //     var textnode = document.createTextNode(subject.name);  // create text node
    //     para.appendChild(textnode);                    // append text to <p>
    //     listitem.appendChild(para);                    // append <p> to <li>
    //     menuSubjectsSurvey.appendChild(listitem);      // append <li> to <ul>

    //     listitem.addEventListener('click', () => {
    //         'use strict';
    //         // retrieving selected subject from closure
    //         currentSubject = subject;
    //         textfieldCurrentSubjectSurvey.value = currentSubject.name;

    //         FirebaseQuestionsModule.readListOfQuestionsFromSubject(currentSubject.key, addMenuEntrySurvey, doneMenuSurvey);
    //     });
    // }

    // ============================================================================================
    // reading list of courses

    function onLoadCourses() {
        'use strict';

        console.log("[Html] > onLoadCourses");
        FirebaseCoursesModule.getCourses().then((coursesList) => {

            courses = coursesList;  // store list of courses in closure

            fillClassesDropDownList(selectCourseQuestionsAdmin, courses);

            if (courses.length === 0) {
                txtStatusBar.value = 'No Courses found!';
            } else {
                txtStatusBar.value = courses.length + ' Courses found!';
            }
        }).catch((err) => {
            console.log('[Html] Reading list of courses failed !');
            console.log('    ' + err);
        }).finally(() => {
            console.log("[Html] > onLoadCourses");
        });
    }

    // ============================================================================================
    // private helper functions (ui - courses drop down menu - admin tab)  

    function fillClassesDropDownList(selectElem, entries) {
        'use strict';

        /*
         *   strucure of HTML drop-down list
         */

        // <select class="mdl-selectfield__select" id="selectStudentsSubjects">
        //     <option value="option0"></option>
        //     <option value="option1">option 1</option>
        //     <option value="option2">option 2</option>
        //     <option value="option3">option 3</option>
        //     <option value="option4">option 4</option>
        //     <option value="option5">option 5</option>
        // </select>

        // clear contents of list
        selectElem.innerHTML = '';

        // add empty node
        addEntryToSelectList(selectElem, 0, null);

        // add each subject of the list
        for (let i = 0; i < entries.length; i++) {
            addEntryToSelectList(selectElem, i + 1, entries[i]);
        }
    }

    function addEntryToSelectList(selectElem, index, entry) {
        'use strict';
        let optionNode = document.createElement('option');    // create <option> node
        optionNode.setAttribute('value', 'option_' + index);  // set attribute

        let text = (entry === null) ? '' : entry.name;
        let textNode = document.createTextNode(text);         // create text node

        optionNode.appendChild(textNode);                     // append text to <option> node
        selectElem.appendChild(optionNode);                   // append <option> node to <select> element
    }

    // function doneMenuSurvey() {
    //     'use strict';
    //     componentHandler.upgradeDom();
    // }

    // ============================================================================================
    // public interface

    return {
        init: init
    };
})();
