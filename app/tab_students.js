/*global dialogPolyfill */
/*global FirebaseClassesModule */
/*global FirebaseStudentsModule */

var HtmlTabStudentsModule = (function () {

    // retrieve HTML elements according to 'students' tab
    var btnCreateStudent = document.getElementById('btnCreateStudent');
    var btnModifyStudent = document.getElementById('btnModifyStudent');
    var btnDeleteStudent = document.getElementById('btnDeleteStudent');
    var btnRefreshStudents = document.getElementById('btnRefreshStudents');

    var selectStudentsClasses = document.getElementById('selectStudentsClasses');

    var txtStudentFirstName = document.getElementById('txtStudentFirstName');
    var txtStudentLastName = document.getElementById('txtStudentLastName');
    var txtStudentEMail = document.getElementById('txtStudentEMail');

    var dialogCreateStudent = document.getElementById('dialogCreateStudent');
    var dialogModifyStudent = document.getElementById('dialogModifyStudent');
    var dialogDeleteStudent = document.getElementById('dialogDeleteStudent');

    var txtStatusBar = document.getElementById('status_bar');

    var tabStudents = document.getElementById('#students-panel');

    // miscellaneous data
    var isActive;
    var classes;
    var classesSelectedIndex;

    // ============================================================================================
    // initialization

    function init() {
        'use strict';
        isActive = false;

        // no classes loaded or selected
        classes = null;
        classesSelectedIndex = -1;

        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        if (!dialogCreateStudent.showModal) {
            dialogPolyfill.registerDialog(dialogCreateStudent);
        }
        // if (!dialogModifyStudent.showModal) {
        //     dialogPolyfill.registerDialog(dialogModifyStudent);
        // }
        // if (!dialogDeleteStudent.showModal) {
        //     dialogPolyfill.registerDialog(dialogDeleteStudent);
        // }

        btnCreateStudent.addEventListener('click', onClickEvent);
        btnModifyStudent.addEventListener('click', onClickEvent);
        btnDeleteStudent.addEventListener('click', onClickEvent);
        btnRefreshStudents.addEventListener('click', onClickEvent);

        selectStudentsClasses.addEventListener('change', onChangeEvent);

        dialogCreateStudent.querySelector('.create_student').addEventListener('click', () => {
            'use strict';
            doCreateStudent();
        });

        dialogCreateStudent.querySelector('.cancel_create_student').addEventListener('click', () => {
            'use strict';
            cancelCreateStudent();
        });

        // dialogModifyStudent.querySelector('.modify_class').addEventListener('click', () => {
        //     'use strict';
        //     // doModifyClass();
        // });

        // dialogModifyStudent.querySelector('.cancel_modify_class').addEventListener('click', () => {
        //     'use strict';
        //     // cancelModifyClass();
        // });

        // dialogDeleteStudent.querySelector('.delete_class').addEventListener('click', () => {
        //     'use strict';
        //     // doDeleteClass();
        // });

        // dialogDeleteStudent.querySelector('.cancel_delete_class').addEventListener('click', () => {
        //     'use strict';
        //     // cancelDeleteClass();
        // });

        tabStudents.addEventListener('click', () => {
            'use strict';
            onUpdateDropDownListOfClasses();
        });
    }

    // ============================================================================================
    // click event dispatching routine

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateStudent":
                onCreateStudent();
                break;
            // case "btnModifyStudent":
            //     onModifyStudent();
            //     break;
            // case "btnDeleteStudent":
            //     onDeleteStudent();
            //     break;
            // case "btnRefreshStudents":
            //     onUpdateStudent();
            //     break;
        }
    }

    // ============================================================================================
    // click event dispatching routine

    function onChangeEvent() {
        'use strict';
        var sender = this.id

        console.log("select ...  value == " + this.value);

        // retrieve index of selected item
        var start = 'option_'.length;
        var reminder = this.value.substr(start);

        // store currently selected class (index of this class) in closure
        classesSelectedIndex = parseInt(reminder);



        console.log("Index == " + classesSelectedIndex);

        // let options = selectStudentsClasses.querySelectorAll('option');
        // let count = options.length;
        // if (typeof count == 'undefined') {
        //     console.log("arghhhhhhhhh ....");
        // }
    }

    // function onClickEvent() {
    //     'use strict';
    //     var sender = this.id;

    //     switch (sender) {
    //         case "btnCreateStudent":
    //             onCreateEvent();
    //             break;
    //         // case "btnModifySubject":
    //         //     onModifyEvent();
    //         //     break;
    //         // case "btnDeleteSubject":
    //         //     onDeleteEvent();
    //         //     break;
    //         // case "btnRefreshSubjects":
    //         //     onRefreshEvent();
    //         //     break;
    //     }
    // }

    // ============================================================================================
    // create new student

    function onCreateStudent() {
        'use strict';
        if (classesSelectedIndex == -1 || classesSelectedIndex == 0) {
            window.alert("No Class existent or selected!");
            return null;
        }

        dialogCreateStudent.showModal();
    }

    function doCreateStudent() {
        'use strict';
        var firstname = txtStudentFirstName.value;
        var lastname = txtStudentLastName.value;
        var email = txtStudentEMail.value;

        if (firstname === '' || lastname === '' || email === '') {
            window.alert("'FirstName'field or 'LastName' field or 'EMail' field emtpy !");
            return null;
        }

        if (isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > doCreateStudent");

        // retrieve key of currently selected class (index starts at 1, array at 0)
        var key = classes[classesSelectedIndex - 1].key;

        FirebaseStudentsModule.addStudent(firstname, lastname, email, key)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Added Student '" + firstname + ' ' + lastname + "' to Repository !";
                return key;
            }).then((key) => {
                return updateTableOfStudents(false, false);
            }).catch((msg) => {
                // log error message to status line
                txtStatusBar.value = msg;
            }).finally(() => {
                txtStudentFirstName.value = '';
                txtStudentLastName.value = '';
                txtStudentEMail.value = '';

                dialogCreateStudent.close();

                isActive = false;
                console.log("[Html] < doCreateStudent");
            });
    }

    function cancelCreateStudent() {
        'use strict';
        txtStudentFirstName.value = '';
        txtStudentLastName.value = '';
        txtStudentEMail.value = '';

        dialogCreateStudent.close();
    }

    // ============================================================================================
    // refresh registered classes

    function onUpdateStudent() {
        updateTableOfStudents(true, true);
    }

    function updateTableOfStudents(checkGuard, verbose) {
        'use strict';
        if (checkGuard && isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        return null;  // empty promise 
    }

    // ============================================================================================
    // reading list of subjects (synchronously)

    function onUpdateDropDownListOfClasses() {
        'use strict';

        console.log("[Html] > onUpdateDropDownListOfClasses");
        FirebaseClassesModule.getClasses().then((classesList) => {

            classes = classesList;  // store read classes in closure

            fillClassesDropDownList(selectStudentsClasses, classesList);

            if (classesList.length === 0) {
                txtStatusBar.value = 'No Classes found!';
            } else {
                txtStatusBar.value = classesList.length + ' Classes found!';
            }
        }).catch((err) => {
            console.log('[Html] Reading list of classes failed !');
            console.log('    ' + err);
        }).finally(() => {
            isActive = false;
            console.log("[Html] > onUpdateDropDownListOfClasses");
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
        addEntry(selectElem, 0, null);

        // add each subject of the list
        for (let i = 0; i < entries.length; i++) {
            addEntry(selectElem, i + 1, entries[i]);
        }
    }

    function addEntry(selectElem, index, entry) {
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