/*global FirebaseCoursesModule */
/*global dialogPolyfill */
/*global componentHandler */

var HtmlTabCoursesModule = (function () {

    // retrieve HTML elements according to 'Courses' tab
    var btnCreateCourse = document.getElementById('btnCreateCourse');
    var btnModifyCourse = document.getElementById('btnModifyCourse');
    var btnDeleteCourse = document.getElementById('btnDeleteCourse');
    var btnRefreshCourses = document.getElementById('btnRefreshCourses');

    var dialogCreateCourse = document.getElementById('dialogCreateCourse');
    var dialogModifyCourse = document.getElementById('dialogModifyCourse');
    var dialogDeleteCourse = document.getElementById('dialogDeleteCourse');

    var txtCourse = document.getElementById('txtCourse');
    var txtDescription = document.getElementById('txtDescription');
    var txtCourseModified = document.getElementById('txtCourseModified');
    var txtDescriptionModified = document.getElementById('txtDescriptionModified');
    var txtCourseToDelete = document.getElementById('txtCourseToDelete');

    var tableCoursesBody = document.getElementById('tableCoursesBody');

    var txtStatusBar = document.getElementById('status_bar');

    // miscellaneous data
    var lastCheckedCourse;
    var isActive;

    // ============================================================================================
    // initialization

    function init() {
        // courses
        lastCheckedCourse = -1;
        isActive = false;

        // connect ui elements with event handlers
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        if (!dialogCreateCourse.showModal) {
            dialogPolyfill.registerDialog(dialogCreateCourse);
        }
        if (!dialogModifyCourse.showModal) {
            dialogPolyfill.registerDialog(dialogModifyCourse);
        }
        if (!dialogDeleteCourse.showModal) {
            dialogPolyfill.registerDialog(dialogDeleteCourse);
        }

        btnCreateCourse.addEventListener('click', onClickEvent);
        btnModifyCourse.addEventListener('click', onClickEvent);
        btnDeleteCourse.addEventListener('click', onClickEvent);
        btnRefreshCourses.addEventListener('click', onClickEvent);

        dialogCreateCourse.querySelector('.create').addEventListener('click', () => {
            'use strict';
            doCreateEvent();
        });

        dialogCreateCourse.querySelector('.cancel_create').addEventListener('click', () => {
            'use strict';
            cancelCreateEvent();
        });

        dialogModifyCourse.querySelector('.modify').addEventListener('click', () => {
            'use strict';
            doModifyEvent();
        });

        dialogModifyCourse.querySelector('.cancel_modify').addEventListener('click', () => {
            'use strict';
            cancelModifyEvent();
        });

        dialogDeleteCourse.querySelector('.delete').addEventListener('click', () => {
            'use strict';
            doDeleteEvent();
        });

        dialogDeleteCourse.querySelector('.cancel_delete').addEventListener('click', () => {
            'use strict';
            cancelDeleteEvent();
        });

        // Funktioniert -- aber ich will das lieber mit checkboxes lösen
        // tableSubjectsBody.onclick = function (ev) {
        //     // ev.target <== td element
        //     // ev.target.parentElement <== tr
        //     var index = ev.target.parentElement.rowIndex;

        //     console.log('Yeahhhhhhhh: ' + index);
        // }
    }

    // ============================================================================================
    // click event dispatching routine

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateCourse":
                onCreateEvent();
                break;
            case "btnModifyCourse":
                onModifyEvent();
                break;
            case "btnDeleteCourse":
                onDeleteEvent();
                break;
            case "btnRefreshCourses":
                onRefreshEvent();
                break;
        }
    }

    // ============================================================================================
    // courses

    /*
     *  reading list of courses (asynchronously) - using callbacks
     */

    function onRefreshEvent() {
        'use strict';
        updateTableOfCoursesPr();
    }

    function updateTableOfCoursesCb() {
        'use strict';
        updateTableOfCoursesBegin();
        FirebaseCoursesModule.readListOfCoursesCb(updateTableOfCoursesNext, updateTableOfCoursesDone);
    }

    function updateTableOfCoursesBegin() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("updateTableOfCoursesBegin");
        lastCheckedCourse = -1;
        tableCoursesBody.innerHTML = '';
        componentHandler.upgradeDom();
    }

    function updateTableOfCoursesNext(course) {
        'use strict';
        addEntryToCourseTable(course);
    }

    function updateTableOfCoursesDone() {
        'use strict';
        isActive = false;
    }

    /*
     *  reading list of Courses (synchronously)- using promises
     */

    function updateTableOfCoursesPr() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("[Html] > updateTableOfCoursesPr");

        tableCoursesBody.innerHTML = '';
        FirebaseCoursesModule.readListOfCoursesPr().then((listOfCourses) => {
            for (var i = 0; i < listOfCourses.length; i++) {
                var course = listOfCourses[i]
                addEntryToCourseTable(tableCoursesBody, i, course);
            }
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            isActive = false;
            console.log("[Html] < updateTableOfCoursesPr");
        });
    }

    // ============================================================================================
    // create new course

    function onCreateEvent() {
        dialogCreateCourse.showModal();
    }

    function doCreateEvent() {
        'use strict';
        var name = txtCourse.value;
        var description = txtDescription.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
        }
        else {
            FirebaseCoursesModule.addCourse(name, description);
            updateTableOfCoursesPr();
        }

        txtCourse.value = '';
        txtDescription.value = '';
        dialogCreateCourse.close();
    }

    function cancelCreateEvent() {
        'use strict';
        txtCourse.value = '';
        txtDescription.value = '';
        lastCheckedCourse = -1;
        dialogCreateCourse.close();
    }

    /*
     *  modify existing course
     */

    function onModifyEvent() {
        'use strict';
        if (lastCheckedCourse === -1) {

            console.log("Warning: No course selected !");
            return;
        }

        var course = FirebaseCoursesModule.getCourse(lastCheckedCourse - 1);
        txtCourseModified.value = course.name;
        txtDescriptionModified.value = course.description;
        dialogModifyCourse.showModal();
    }

    function doModifyEvent() {
        'use strict';
        var name = txtCourseModified.value;
        var description = txtDescriptionModified.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
        }
        else {
            var course = FirebaseCoursesModule.getCourse(lastCheckedCourse - 1);
            course.name = name;
            course.description = description;
            FirebaseCoursesModule.updateCourse(course);
            updateTableOfCoursesPr();
        }

        txtCourseModified.value = '';
        txtDescriptionModified.value = '';
        dialogModifyCourse.close();
    }

    function cancelModifyEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedCourse);
        checkboxLabel.MaterialCheckbox.uncheck();
        txtCourseModified.value = '';
        txtDescriptionModified.value = '';
        lastCheckedCourse = -1;
        dialogModifyCourse.close();
    }

    /*
     *  delete existing course
     */

    function onDeleteEvent() {
        'use strict';
        if (lastCheckedCourse === -1) {

            console.log("Warning: No course selected !");
            return;
        }

        var course = FirebaseCoursesModule.getCourse(lastCheckedCourse - 1);
        txtCourseToDelete.value = course.name;
        dialogDeleteCourse.showModal();
    }

    function doDeleteEvent() {
        'use strict';
        console.log("Course to delete: " + txtCourseToDelete.value);
        FirebaseCoursesModule.deleteCourse(txtCourseToDelete.value);
        txtCourseToDelete.value = '';
        dialogDeleteCourse.close();

        updateTableOfCoursesBegin();
        FirebaseCoursesModule.readListOfCoursesCb(updateTableOfCoursesNext, updateTableOfCoursesDone);
    }

    function cancelDeleteEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedCourse);
        checkboxLabel.MaterialCheckbox.uncheck();
        lastCheckedCourse = -1;
        dialogDeleteCourse.close();
    }

    // ============================================================================================
    // private helper functions

    function addEntryToCourseTable(tablebody, index, entry) {
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
        //      <td class="mdl-data-table__cell--non-numeric">Beyond C</td>
        //  </tr>

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var label = document.createElement('label');     // create <label> node

        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attribute
        label.setAttribute('for', 'row_' + index);  // set attribute
        label.setAttribute('id', 'label_' + index);  // set attribute
        var input = document.createElement('input');     // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input checkbox_select_course');  // set attribute
        input.setAttribute('type', 'checkbox');  // set attributes
        input.setAttribute('id', 'row_' + index);  // set attribute
        input.addEventListener('click', checkboxHandler);
        label.appendChild(input);
        td1.appendChild(label);

        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        var textnode1 = document.createTextNode(entry.name);             // create second text node
        var textnode2 = document.createTextNode(entry.description);      // create third text node
        td2.appendChild(textnode1);     // append text to <td>
        td3.appendChild(textnode2);     // append text to <td>
        node.appendChild(td1);          // append <td> to <tr>
        node.appendChild(td2);          // append <td> to <tr>
        node.appendChild(td3);          // append <td> to <tr>
        tablebody.appendChild(node);    // append <tr> to <tbody>

        componentHandler.upgradeDom();
    }

    function checkboxHandler() {
        'use strict';
        console.log('[Html] clicked at checkbox: ' + this.id + ' [checkbox is checked: ' + this.checked + ' ]');

        // calculate index of row
        var row = parseInt(this.id.substring(4));  // omitting 'row_'

        if (this.checked) {

            lastCheckedCourse = row;

            var boxes = tableCoursesBody.getElementsByClassName('checkbox_select_course');
            for (var k = 0; k < boxes.length; k++) {

                if (k != lastCheckedCourse) {
                    var label = boxes[k];
                    label.parentElement.MaterialCheckbox.uncheck();
                }
            }
        }
        else {

            if (row === lastCheckedCourse) {

                // clear last selection
                lastCheckedCourse = -1;
            }
        }
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        // updateTableOfCoursesCb: updateTableOfCoursesCb,
        updateTableOfCoursesPr: updateTableOfCoursesPr
    };
})();