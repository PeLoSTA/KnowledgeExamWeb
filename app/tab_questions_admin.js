/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */
/*global HtmlTabMiscModule */
/*global dialogPolyfill */
/*global componentHandler */

var HtmlTabQuestionsAdminModule = (function () {

    // retrieve HTML elements according to 'questions administrations' tab
    var tabQuestionsAdmin = document.getElementById('#questions-panel-admin');
    var dialogCreateQuestion = document.getElementById('dialogCreateQuestion');
    var btnEnterQuestion = document.getElementById('btnEnterQuestion');
    var txtQuestionAdmin = document.getElementById('txtQuestionAdmin');
    var divAnchorAnswers = document.getElementById('divAnchorAnswers');
    var divAnchorCorrectAnswers = document.getElementById('divAnchorCorrectAnswers');
    var labelNumAnswers = document.getElementById('labelNumAnswers');
    var listItem2 = document.getElementById('list-num-answers-2');
    var listItem3 = document.getElementById('list-num-answers-3');
    var listItem4 = document.getElementById('list-num-answers-4');
    var listItem5 = document.getElementById('list-num-answers-5');
    var listItem6 = document.getElementById('list-num-answers-6');
    var listItem7 = document.getElementById('list-num-answers-7');
    var listItem8 = document.getElementById('list-num-answers-8');
    var listItem9 = document.getElementById('list-num-answers-9');

    var selectCourseQuestionsAdmin = document.getElementById('selectCourseQuestionsAdmin');

    var txtStatusBar = document.getElementById('status_bar');

    // miscellaneous data
    var isActive;               // guard for double click events
    var numAnswers;             // needed for 'create question' dialog
    var coursesSelectedIndex;   // needed to assign question input to this course (admin)
    var courses;                // list of courses

    // ============================================================================================
    // initialization

    function init() {
        // questions
        numAnswers = 2;

        // no courses loaded or selected
        courses = null;
        coursesSelectedIndex = -1;

        // connect ui elements with event handlers
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        if (!dialogCreateQuestion.showModal) {
            dialogPolyfill.registerDialog(dialogCreateQuestion);
        }

        btnEnterQuestion.addEventListener('click', () => {
            'use strict';
            onCreateQuestion();
        });

        selectCourseQuestionsAdmin.addEventListener('change', onChangeEvent);

        dialogCreateQuestion.querySelector('.create_question').addEventListener('click', () => {
            'use strict';
            doCreateQuestion();
        });

        dialogCreateQuestion.querySelector('.cancel_question').addEventListener('click', () => {
            'use strict';
            cancelCreateQuestion();
        });

        listItem2.addEventListener('click', helperDialogDisplay(2));
        listItem3.addEventListener('click', helperDialogDisplay(3));
        listItem4.addEventListener('click', helperDialogDisplay(4));
        listItem5.addEventListener('click', helperDialogDisplay(5));
        listItem6.addEventListener('click', helperDialogDisplay(6));
        listItem7.addEventListener('click', helperDialogDisplay(7));
        listItem8.addEventListener('click', helperDialogDisplay(8));
        listItem9.addEventListener('click', helperDialogDisplay(9));

        createAnswersList(numAnswers, divAnchorAnswers);
        createAnswersToCheckboxesList(numAnswers, divAnchorCorrectAnswers);

        tabQuestionsAdmin.addEventListener('click', () => {
            'use strict';
            onUpdateDropDownListOfCourses();
        });
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
    }

    // ============================================================================================

    function helperDialogDisplay(number) {
        'use strict';
        // note: the outer function returns an inner function, the variable 'number' is part of the closure (!)
        return function () {
            if (numAnswers != number) {
                numAnswers = number;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        }
    }

    /*
     *  create single question
     */

    function onCreateQuestion() {
        'use strict';
        if (coursesSelectedIndex === -1) {
            alert("Please choose Course !");
            return;
        }

        dialogCreateQuestion.showModal();
    }

    function doCreateQuestion() {
        'use strict';
        addQuestion();
        dialogCreateQuestion.close();
        clearDialog();
    }

    function cancelCreateQuestion() {
        'use strict';
        dialogCreateQuestion.close();
        clearDialog();
    }

    function createAnswersList(number, outerDiv) {
        'use strict';
        outerDiv.innerHTML = '';
        for (var i = 0; i < number; i++) {

            var divOuterNode = document.createElement('div');           // create outer <div> node
            var divInnerNode = document.createElement('div');           // create inner <div> node

            divInnerNode.setAttribute('class', 'mdl-textfield mdl-js-textfield');      // set attribute
            var textareaNode = document.createElement('textarea');      // create inner <textarea> node
            textareaNode.setAttribute('class', 'mdl-textfield__input'); // set attribute
            textareaNode.setAttribute('type', 'text');                  // set attribute
            textareaNode.setAttribute('rows', '1');                     // set attribute
            textareaNode.setAttribute('id', 'answer' + (i + 1));        // set attribute

            var labelNode = document.createElement('label');            // create inner <label> node
            labelNode.setAttribute('class', 'mdl-textfield__label');    // set attribute
            labelNode.setAttribute('for', 'answer' + (i + 1));          // set attribute

            var textnode = document.createTextNode('...');  // create inner text node
            labelNode.appendChild(textnode);                // append text to <label>
            divInnerNode.appendChild(textareaNode);  // append <textarea> to <div>
            divInnerNode.appendChild(labelNode);     // append <label> to <div>
            divOuterNode.appendChild(divInnerNode);  // append inner <div> to outer <div> node
            outerDiv.appendChild(divOuterNode);      // append outer <div> node to anchor <div> node
        }

        componentHandler.upgradeDom();
    }

    function createAnswersToCheckboxesList(number, outerDiv) {
        'use strict';
        outerDiv.innerHTML = '';
        for (var i = 0; i < number; i++) {

            var label = document.createElement('label');      // create <label> node
            label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect');
            label.setAttribute('for', 'for-id-' + (i + 1));

            var input = document.createElement('input');      // create <input> node
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', 'for-id-' + (i + 1));
            input.setAttribute('class', 'mdl-checkbox__input');

            var span = document.createElement('span');        // create <span> node
            span.setAttribute('class', 'mdl-checkbox__label');

            var textnode = document.createTextNode('Antwort ' + (i + 1));  // create inner text node

            span.appendChild(textnode);     // append text to <span> node
            label.appendChild(input);       // append <input> to <label>
            label.appendChild(span);        // append <span> to <label>
            outerDiv.appendChild(label);    // append <label> to outer <div> node
        }

        componentHandler.upgradeDom();
    }

    function updateNumAnswersDisplay(number, label) {
        'use strict';
        label.innerHTML = '';
        var textnode = document.createTextNode('' + number);  // create new text node
        label.appendChild(textnode);  // insert text into <label> node
    }

    function updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers) {
        'use strict';
        updateNumAnswersDisplay(numAnswers, labelNumAnswers);
        createAnswersList(numAnswers, divAnchorAnswers);
        createAnswersToCheckboxesList(numAnswers, divAnchorCorrectAnswers);
    }

    // ============================================================================================
    // private helper functions (administration)

    function addQuestion() {
        'use strict';
        var question = txtQuestionAdmin.value;
        if (question === "") {
            window.alert("Empty Question !");
            return;
        }

        var answers = [];
        var childrenAnswers = divAnchorAnswers.getElementsByTagName('textarea');
        for (var i = 0; i < childrenAnswers.length; i++) {
            answers.push(childrenAnswers[i].value);
        }

        var correctAnswers = [];
        var numCorrectAnswers = 0;
        var childrenCorrectAnswers = divAnchorCorrectAnswers.getElementsByClassName('mdl-checkbox');
        for (i = 0; i < childrenCorrectAnswers.length; i++) {

            var label = childrenCorrectAnswers[i];
            var classAttributes = label.getAttribute("class");
            var result = classAttributes.includes('is-checked');

            if (result === true) {
                numCorrectAnswers++;
                correctAnswers.push(true);
            } else {
                correctAnswers.push(false);
            }
        }

        // assertion: lists must have same size
        if (answers.length != correctAnswers.length) {
            window.alert("Internal Error: Lists of answers and their solutions have different size !");
            return;
        }

        // retrieve key of selected course
        var course = FirebaseCoursesModule.getCourse(coursesSelectedIndex - 1);
        var key = course.key;

        FirebaseQuestionsModule.addQuestion(question, key, answers, correctAnswers)
            .then(() => {
                txtStatusBar.value = 'Added question successfully!';
            });
    }

    function clearDialog() {
        'use strict';
        txtQuestionAdmin.value = '';
        numAnswers = 2;
        updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
    }

    // ============================================================================================
    // reading list of courses

    function onUpdateDropDownListOfCourses() {
        'use strict';

        console.log("[Html] > onUpdateDropDownListOfCourses");
        FirebaseCoursesModule.getCourses().then((coursesList) => {

            courses = coursesList;  // store list of courses in closure

            HtmlTabMiscModule.fillCoursesDropDownList(selectCourseQuestionsAdmin, courses);

            if (courses.length === 0) {
                txtStatusBar.value = 'No Courses found!';
            } else {
                txtStatusBar.value = courses.length + ' Courses found!';
            }
        }).catch((err) => {
            console.log('[Html] Reading list of courses failed !');
            console.log('    ' + err);
        }).finally(() => {
            isActive = false;
            console.log("[Html] < onUpdateDropDownListOfCourses");
        });
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    };
})();
