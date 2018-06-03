/*global FirebaseClassesModule */
/*global FirebaseStudentsModule */
/*global dialogPolyfill */
/*global componentHandler */

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

    var tableStudentsBody = document.getElementById('tableStudentsBody');

    var dialogCreateStudent = document.getElementById('dialogCreateStudent');
    var dialogModifyStudent = document.getElementById('dialogModifyStudent');
    var dialogDeleteStudent = document.getElementById('dialogDeleteStudent');

    var txtStatusBar = document.getElementById('status_bar');

    var tabStudents = document.getElementById('#students-panel');

    // miscellaneous data
    var isActive;
    var classes;
    var classesSelectedIndex;
    var lastCheckedStudent;

    const prefix_checkboxes = 'row_student_';

    // ============================================================================================
    // initialization

    function init() {
        'use strict';
        isActive = false;

        // no classes loaded or selected
        classes = null;
        classesSelectedIndex = -1;

        lastCheckedStudent = -1;

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
    // click event dispatching routine: buttons

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
            case "btnRefreshStudents":
                onUpdateStudent();
                break;
        }
    }

    // ============================================================================================
    // click event dispatching routine: select box

    function onChangeEvent() {
        'use strict';

        // retrieve index of selected item
        var start = 'option_'.length;
        var reminder = this.value.substr(start);

        // store currently selected class (index of this class) in closure
        classesSelectedIndex = parseInt(reminder);
    }

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
        var keyClass = classes[classesSelectedIndex - 1].key;

        FirebaseStudentsModule.addStudent(firstname, lastname, email, keyClass)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Added Student '" + firstname + ' ' + lastname + "' to Repository !";
                return key;
            }).then((key) => {
                return updateTableOfStudents(false, false, keyClass);
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

        if (classesSelectedIndex == -1 || classesSelectedIndex == 0) {
            updateTableOfStudents(true, true);
        } else {
            // retrieve key of currently selected class
            var keyClass = classes[classesSelectedIndex-1].key;
            updateTableOfStudents(true, true, keyClass);
        }
    }

    function updateTableOfStudents(checkGuard, verbose, keyClass) {
        'use strict';
        if (checkGuard && isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > updateTableOfAllStudents");

        tableStudentsBody.innerHTML = '';
        return FirebaseStudentsModule.getStudents(keyClass).then((listOfStudents) => {
            for (var i = 0; i < listOfStudents.length; i++) {
                var student = listOfStudents[i]
                addEntryToStudentTable(tableStudentsBody, i, student);
            }
            return listOfStudents.length;
        }).then((number) => {
            if (verbose) {
                // refresh status line
                txtStatusBar.value = number + ' students';
            }
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            isActive = false;
            console.log("[Html] < updateTableOfAllStudents");
        });
    }

    // ============================================================================================
    // reading list of classes

    function onUpdateDropDownListOfClasses() {
        'use strict';

        console.log("[Html] > onUpdateDropDownListOfClasses");
        FirebaseClassesModule.getClasses().then((classesList) => {

            classes = classesList;  // store list of classes in closure

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

    function addEntryToStudentTable(tablebody, index, entry) {
        'use strict';

        // adding dynamically a 'material design lite' node to a table, for example
        //
        //  <tr>
        //    <td>
        //      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //          <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //      </label>
        //    </td>
        //      <td class="mdl-data-table__cell--non-numeric">C++</td>
        //      <td class="mdl-data-table__cell--non-numeric">...</td>
        //      <td class="mdl-data-table__cell--non-numeric">...</td>
        //  </tr>

        var node = document.createElement('tr');      // create <tr> node
        var td1 = document.createElement('td');       // create first <td> node
        var label = document.createElement('label');  // create <label> node

        var uniqueId = prefix_checkboxes + index;     // need unique checkbox id for entire document

        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attribute
        label.setAttribute('for', uniqueId);          // set attribute
        label.setAttribute('id', 'label_' + index);   // set attribute
        var input = document.createElement('input');  // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input checkbox_select_student');  // set attribute
        input.setAttribute('type', 'checkbox');       // set attributes
        input.setAttribute('id', uniqueId);           // set attribute
        input.addEventListener('click', checkboxHandler);
        label.appendChild(input);
        td1.appendChild(label);

        var td2 = document.createElement('td');       // create 2nd <td> node
        var td3 = document.createElement('td');       // create 3rd <td> node
        var td4 = document.createElement('td');       // create 4th <td> node
        var td5 = document.createElement('td');       // create 5th <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td4.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td5.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute

        var className = FirebaseClassesModule.getNameOfClass(entry.key);
        var textnode1 = document.createTextNode(className);        // create 2nd text node (class)
        var textnode2 = document.createTextNode(entry.firstname);  // create 3rd text node (firstname)
        var textnode3 = document.createTextNode(entry.lastname);   // create 4th text node (lastname)
        var textnode4 = document.createTextNode(entry.email);      // create 5th text node (email)

        td2.appendChild(textnode1);     // append text to <td>
        td3.appendChild(textnode2);     // append text to <td>
        td4.appendChild(textnode3);     // append text to <td>
        td5.appendChild(textnode4);     // append text to <td>
        node.appendChild(td1);          // append <td> to <tr>
        node.appendChild(td2);          // append <td> to <tr>
        node.appendChild(td3);          // append <td> to <tr>
        node.appendChild(td4);          // append <td> to <tr>
        node.appendChild(td5);          // append <td> to <tr>
        tablebody.appendChild(node);    // append <tr> to <tbody>

        componentHandler.upgradeDom();
    }

    function checkboxHandler() {
        'use strict';
        console.log('[Html] clicked at checkbox: ' + this.id + ' [checkbox is checked: ' + this.checked + ' ]');

        // calculate index of row
        var ofs = prefix_checkboxes.length;
        var row = parseInt(this.id.substring(ofs));  // omitting prefix 'row_student_'

        if (this.checked) {

            lastCheckedStudent = row;

            var boxes = tableStudentsBody.getElementsByClassName('checkbox_select_student');
            for (var k = 0; k < boxes.length; k++) {

                if (k != lastCheckedStudent) {
                    var label = boxes[k];
                    label.parentElement.MaterialCheckbox.uncheck();
                }
            }
        }
        else {

            if (row === lastCheckedStudent) {

                // clear last selection
                lastCheckedStudent = -1;
            }
        }
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    }
})();