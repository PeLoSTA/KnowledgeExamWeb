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

    var selectCourses = document.getElementById('selectCourseQuestionsViewer');
    var txtStatusBar = document.getElementById('status_bar');

    // ============================================================================================
    // initialization

    var courses;             // list of courses
    var questions;           // list of questions

    // ============================================================================================
    // initialization

    function init() {

        courses = null;      // list of courses
        questions = null;    // list of questions

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

        tableQuestionsBody.addEventListener('click', (ev) => {
            'use strict';
            // ev.target <== td element
            // ev.target.parentElement <== tr
            var index = ev.target.parentElement.rowIndex;

            var question = questions[index - 1];
            addAnswersToTableEx(tableAnswersBody, question);
        });

        selectCourses.addEventListener('change', onChangeEvent);
    }

    // ============================================================================================
    // click event dispatching routine: select box

    function onChangeEvent() {
        'use strict';

        // retrieve index of selected item
        var start = 'option_'.length;
        var reminder = this.value.substr(start);

        // store currently selected class (index of this class) in closure
        var index = parseInt(reminder);
        if (index === 0) {
            onLoadQuestionsEx();
        }
        else {
            var course = courses[index - 1];
            onLoadQuestionsOfCourseEx(course.key);
        }

        clearAnswersTable(tableAnswersBody);
    }

    // ============================================================================================
    // reading courses and questions (asynchronously)

    function onLoadCourses() {
        'use strict';

        console.log("[Html] > onLoadCourses");
        FirebaseCoursesModule.getCourses().then((coursesList) => {

            courses = coursesList;  // store list of courses in closure

            fillCoursesDropDownList(selectCourses, courses);

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

    function onLoadQuestionsEx() {
        'use strict';
        console.log("[Html] > onLoadQuestionsEx");

        tableQuestionsBody.innerHTML = '';
        return FirebaseQuestionsModule.getQuestions().then((listOfQuestions) => {

            questions = listOfQuestions;  // store list of questions in closure

            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTableEx(tableQuestionsBody, i, question);
            }
            return listOfQuestions.length;
        }).then((number) => {
            // refresh status line
            txtStatusBar.value = 'Found ' + number + ' questions.';
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

            questions = listOfQuestions;  // store list of questions in closure

            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTableEx(tableQuestionsBody, i, question);
            }
            return listOfQuestions.length;
        }).then((number) => {
            // refresh status line
            txtStatusBar.value = 'Found ' + number + ' questions.';
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            componentHandler.upgradeDom();
            console.log("[Html] < onLoadQuestionsOfCourseEx");
        });
    }

    // ============================================================================================
    // private helper functions - higher level

    function fillCoursesDropDownList(selectElem, entries) {
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

    // ============================================================================================
    // private helper functions - higher level

    function addQuestionToTableEx(tablebody, counter, entry) {
        'use strict';

        console.log('addQuestionToTableEx');

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

        var keyOfCourse = entry['course-key'];
        var nameOfSubject = FirebaseCoursesModule.getNameOfCourse(keyOfCourse);
        var node = createQuestion(counter, entry.question, nameOfSubject);
        tablebody.appendChild(node);
    }

    function addAnswersToTableEx(tablebody, entry) {
        'use strict';

        console.log('addAnswersToTableEx');

        // adding dynamically a 'material design lite' node to a table, for example
        //
        //     <tr>
        //         <td>Anwort 1</td>
        //         <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
        //             Nein
        //         </td>
        //         <td>
        //             <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //                 <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //             </label>
        //         </td>
        //     </tr>

        // clear old contents of table
        tablebody.innerHTML = '';

        // add rows for answers
        var numAnswers = entry['num-answers'];
        var numCorrectAnswers = entry['num-correct-answers'];
        var useRadioButton = (numCorrectAnswers === 1);

        for (var row = 0; row < numAnswers; row++) {

            var nodeAnswer = createAnswer(
                row,
                entry.answers[row],
                useRadioButton,
                entry['correct-answers'][row]
            );

            tablebody.appendChild(nodeAnswer);
        }

        txtStatusBar.value = 'Found ' + numAnswers + ' answers.';
    }

    function clearAnswersTable(tablebody) {
        'use strict';

        // clear old contents of table
        tablebody.innerHTML = '';
    }

    // ============================================================================================
    // private helper functions - lower level

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

        // create third node - use number of answer as unique id for underlying label or input control
        var label = (useRadioButton) ?
            createRadioButton(number, isCorrect) :
            createCheckBox(number, isCorrect);

        td3Answer.appendChild(label);       // append <label> to <td>

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
        mdlCheckbox.disable();

        return label;
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    };
})();
