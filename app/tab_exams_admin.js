
/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */
/*global HtmlTabMiscModule */
/*global dialogPolyfill */
/*global componentHandler */

var HtmlTabExamsModule = (function () {

    // retrieve HTML elements according to 'questions viewer' tab
    var tabExamsAdmin = document.getElementById('#create-exam-panel');

    var tableQuestionsBody = document.getElementById('tableQuestionsExamsAdminBody');

    var selectCourses = document.getElementById('selectCourseExamsAdmin');
    var txtStatusBar = document.getElementById('status_bar');

    var courses;             // list of courses
    var questions;           // list of questions

    // ============================================================================================
    // initialization

    function init() {
        'use strict';

        courses = null;      // list of courses
        questions = null;    // list of questions

        // connect ui elements with event handlers
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        tabExamsAdmin.addEventListener('click', () => {
            'use strict';
            onLoadCourses();
            onLoadQuestions();
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
            onLoadQuestions();
        }
        else {
            var course = courses[index - 1];
            onLoadQuestionsOfCourse(course.key);
        }
    }

    // ============================================================================================
    // reading courses and questions (asynchronously)

    function onLoadCourses() {
        'use strict';

        console.log("[Html] > onLoadCourses");
        FirebaseCoursesModule.getCourses().then((coursesList) => {

            courses = coursesList;  // store list of courses in closure

            HtmlTabMiscModule.fillCoursesDropDownList(selectCourses, courses);

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

    function onLoadQuestions() {
        'use strict';
        console.log("[Html] > onLoadQuestions");

        tableQuestionsBody.innerHTML = '';
        return FirebaseQuestionsModule.getQuestions().then((listOfQuestions) => {

            questions = listOfQuestions;  // store list of questions in closure

            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTable(tableQuestionsBody, i, question);
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
            console.log("[Html] < onLoadQuestions");
        });
    }

    function onLoadQuestionsOfCourse(courseKey) {
        'use strict';
        console.log("[Html] > onLoadQuestionsOfCourse");

        tableQuestionsBody.innerHTML = '';
        return FirebaseQuestionsModule.getQuestionsOfCourse(courseKey).then((listOfQuestions) => {

            questions = listOfQuestions;  // store list of questions in closure

            for (var i = 0; i < listOfQuestions.length; i++) {
                var question = listOfQuestions[i]
                addQuestionToTable(tableQuestionsBody, i, question);
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
            console.log("[Html] < onLoadQuestionsOfCourse");
        });
    }

    // ============================================================================================
    // private helper functions - higher level

    function addQuestionToTable(tablebody, counter, entry) {
        'use strict';

        console.log('addQuestionToTable');

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

    // ============================================================================================

    return {
        init: init
    };

})();