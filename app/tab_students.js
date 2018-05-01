var HtmlTabStudentsModule = (function () {

    // retrieve HTML elements according to 'questions viewer' tab
    var tabStudents = document.getElementById('#results-of-exams-panel');

    // retrieve HTML elements according to 'students' tab
    var btnCreateStudent = document.getElementById('btnCreateStudent');
    var btnModifyStudent = document.getElementById('btnModifyStudent');
    var btnDeleteStudent = document.getElementById('btnDeleteStudent');
    var btnRefreshStudents = document.getElementById('btnRefreshStudents');
    var selectStudentsSubjects = document.getElementById('selectStudentsSubjects');

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

        selectStudentsSubjects.addEventListener('change', onChangeEvent);

        tabStudents.addEventListener('click', () => {
            'use strict';
            onUpdateDropDownListOfSubjectsPr();
        });
    }

    // ============================================================================================
    // click event dispatching routine

    function onChangeEvent() {
        'use strict';
        var sender = this.id

        console.log("select ...  value == " + this.value);

        let options = selectStudentsSubjects.querySelectorAll('option');
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
    // reading list of subjects (synchronously)- using promises

    function onUpdateDropDownListOfSubjectsPr() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring update event!");
            return;
        }

        isActive = true;

        console.log("updateDropDownListOfSubjectsPr");

        FirebaseSubjectsModule.readListOfSubjectsPr().then((listOfSubjects) => {
            // for (var i = 0; i < listOfSubjects.length; i++) {
            //     var subject = listOfSubjects[i]
            //     console.log("    ===> " + subject.name);
            //     addEntryToSubjectTable(subject);
            // }

            addEntriesToSubjectsDropDownList(selectStudentsSubjects, listOfSubjects);

        }).catch((err) => {
            console.log('Reading list of subjects failed !!!!!!!!!!!!!');
            console.log('    ' + err);
        });

        isActive = false;
    };

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
        selectStudentsSubjects.innerHTML = '';

        // add empty node
        addEntryToSubjectsDropDownList(selectStudentsSubjects, 0, null);

        // add each subject of the list
        for (let i = 0; i < entries.length; i++) {
            addEntryToSubjectsDropDownList(selectStudentsSubjects, i + 1, entries[i]);
        }
    }

    function addEntryToSubjectsDropDownList(selectElem, index, entry) {
        'use strict';
        let optionNode = document.createElement('option');    // create <option> node
        optionNode.setAttribute('value', 'option_' + index);  // set attribute

        let text = (entry === null) ? '' : entry.name;
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