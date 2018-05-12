/*global FirebaseSubjectsModule */
/*global FirebaseCoursesModule */
/*global FirebaseStudentsModule */

var HtmlTabStudentsModule = (function () {

    // retrieve HTML elements according to 'students' tab
    var btnCreateStudent = document.getElementById('btnCreateStudent');
    var btnModifyStudent = document.getElementById('btnModifyStudent');
    var btnDeleteStudent = document.getElementById('btnDeleteStudent');
    var btnRefreshStudents = document.getElementById('btnRefreshStudents');
    var selectStudentsCourses = document.getElementById('selectStudentsCourses');

    var txtStatusBar = document.getElementById('status_bar');

    var tabStudents = document.getElementById('#students-panel');

    // miscellaneous data
    var isActive;

    // ============================================================================================
    // initialization

    function init() {
        'use strict';
        isActive = false;
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        btnCreateStudent.addEventListener('click', onClickEvent);
        btnModifyStudent.addEventListener('click', onClickEvent);
        btnDeleteStudent.addEventListener('click', onClickEvent);
        btnRefreshStudents.addEventListener('click', onClickEvent);

        selectStudentsCourses.addEventListener('change', onChangeEvent);

        tabStudents.addEventListener('click', () => {
            'use strict';
            onUpdateDropDownListOfCourses();
        });
    }

    // ============================================================================================
    // click event dispatching routine

    function onChangeEvent() {
        'use strict';
        var sender = this.id

        console.log("select ...  value == " + this.value);

        let options = selectStudentsCourses.querySelectorAll('option');
        let count = options.length;
        if (typeof count == 'undefined') {
            console.log("arghhhhhhhhh ....");
        }
    }

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateStudent":
                onCreateEvent();
                break;
            // case "btnModifySubject":
            //     onModifyEvent();
            //     break;
            // case "btnDeleteSubject":
            //     onDeleteEvent();
            //     break;
            // case "btnRefreshSubjects":
            //     onRefreshEvent();
            //     break;
        }
    }

    // ============================================================================================
    // reading list of subjects (synchronously)

    function onUpdateDropDownListOfCourses() {
        'use strict';

        console.log("[Html] > onUpdateDropDownListOfCourses");
        FirebaseCoursesModule.getCourses().then((coursesList) => {
            addEntriesToSubjectsDropDownList(selectStudentsCourses, coursesList);

            if (coursesList.length === 0) {
                txtStatusBar.value = 'No Courses found!';
            } else {
                txtStatusBar.value = coursesList.length + ' Courses found!';
            }
        }).catch((err) => {
            console.log('[Html] Reading list of courses failed !');
            console.log('    ' + err);
        }).finally(() => {
            isActive = false;
            console.log("[Html] > onUpdateDropDownListOfCourses");
        });
    }

    // ============================================================================================
    // helper functions

    function onCreateEvent() {

        FirebaseStudentsModule.addStudent3('Hans', 'Peter', '567567567')
            .then(function (key) {
                console.log('Yes: ' + key);
            })
            .catch(function (err) {
                console.log('No: ');
                let msg = "Error " + err.code + ", Message: " + err.message;
                console.log(msg);
            });

    }

    function addEntriesToSubjectsDropDownList(selectElem, entries) {
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
        addEntryToCoursesDropDownList(selectElem, 0, null);

        // add each subject of the list
        for (let i = 0; i < entries.length; i++) {
            addEntryToCoursesDropDownList(selectElem, i + 1, entries[i]);
        }
    }

    function addEntryToCoursesDropDownList(selectElem, index, entry) {
        'use strict';
        let optionNode = document.createElement('option');    // create <option> node
        optionNode.setAttribute('value', 'option_' + index);  // set attribute

        let text = (entry === null) ? 'Choose Course ...' : entry.name;
        let textNode = document.createTextNode(text);         // create text node

        optionNode.appendChild(textNode);                     // append text to <option> node
        selectElem.appendChild(optionNode);                   // append <option> node to <select> element
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    }
})();