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

    var txtCourseName = document.getElementById('txtCourseName');
    var txtCourseDescription = document.getElementById('txtCourseDescription');
    var txtCourseNameModified = document.getElementById('txtCourseNameModified');
    var txtCourseDescriptionModified = document.getElementById('txtCourseDescriptionModified');
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

        dialogCreateCourse.querySelector('.create_course').addEventListener('click', () => {
            'use strict';
            doCreateCourse();
        });

        dialogCreateCourse.querySelector('.cancel_create_course').addEventListener('click', () => {
            'use strict';
            cancelCreateCourse();
        });

        dialogModifyCourse.querySelector('.modify_course').addEventListener('click', () => {
            'use strict';
            doModifyCourse();
        });

        dialogModifyCourse.querySelector('.cancel_modify_course').addEventListener('click', () => {
            'use strict';
            cancelModifyCourse();
        });

        dialogDeleteCourse.querySelector('.delete_course').addEventListener('click', () => {
            'use strict';
            doDeleteCourse();
        });

        dialogDeleteCourse.querySelector('.cancel_delete_course').addEventListener('click', () => {
            'use strict';
            cancelDeleteCourse();
        });
    }

    // ============================================================================================
    // click event dispatching routine

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateCourse":
                onCreateCourse();
                break;
            case "btnModifyCourse":
                onModifyCourse();
                break;
            case "btnDeleteCourse":
                onDeleteCourse();
                break;
            case "btnRefreshCourses":
                onRefreshCourse();
                break;
        }
    }

    // ============================================================================================
    // create new course

    function onCreateCourse() {
        dialogCreateCourse.showModal();
    }

    function doCreateCourse() {
        'use strict';
        var name = txtCourseName.value;
        var description = txtCourseDescription.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
            return null;
        }

        if (isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > doCreateCourse");

        FirebaseCoursesModule.addCourse(name, description)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Added Course '" + name + "' to Repository [Key = " + key + "]!";
                return key;
            }).then((key) => {
                return updateTableOfCourses(false, false);
            }).catch((msg) => {
                // log error message to status line
                txtStatusBar.value = msg;
            }).finally(() => {
                txtCourseName.value = '';
                txtCourseDescription.value = '';
                dialogCreateCourse.close();

                isActive = false;
                console.log("[Html] < doCreateClass");
            });
    }

    function cancelCreateCourse() {
        'use strict';
        txtCourseName.value = '';
        txtCourseDescription.value = '';
        lastCheckedCourse = -1;
        dialogCreateCourse.close();
    }

    // ============================================================================================
    // modify existing course

    function onModifyCourse() {
        'use strict';
        if (lastCheckedCourse === -1) {

            window.alert("Warning: No course selected !");
            return;
        }

        var course = FirebaseCoursesModule.getCourse(lastCheckedCourse);
        txtCourseNameModified.value = course.name;
        txtCourseDescriptionModified.value = course.description;
        dialogModifyCourse.showModal();
    }

    function doModifyCourse() {
        'use strict';
        var name = txtCourseNameModified.value;
        var description = txtCourseDescriptionModified.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
            return null;
        }

        if (isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > doModifyCourse");

        var course = FirebaseCoursesModule.getCourse(lastCheckedCourse);
        course.name = name;
        course.description = description;

        FirebaseCoursesModule.updateCourse(course)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Updated Course '" + name;
                return key;
            }).then((key) => {
                return updateTableOfCourses(false, false);
            }).catch((msg) => {
                // log error message to status line
                txtStatusBar.value = msg;
            }).finally(() => {
                // clear checkbox
                var checkboxLabel = document.getElementById('label_' + lastCheckedCourse);
                checkboxLabel.MaterialCheckbox.uncheck();
                txtCourseNameModified.value = '';
                txtCourseDescriptionModified.value = '';
                lastCheckedCourse = -1;
                dialogModifyCourse.close();

                isActive = false;
                console.log("[Html] < doModifyCourse");
            });
    }

    function cancelModifyCourse() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedCourse);
        checkboxLabel.MaterialCheckbox.uncheck();
        txtCourseNameModified.value = '';
        txtCourseDescriptionModified.value = '';
        lastCheckedCourse = -1;
        dialogModifyCourse.close();
    }

    // ============================================================================================
    // delete existing course

    // Note: 'double click' on delete button needn't to be handled 
    //   - second click runs on a not existing firebase path
    //   - Firebase doesn't complain about this ...

    function onDeleteCourse() {
        'use strict';
        if (lastCheckedCourse === -1) {

            window.alert("Warning: No course selected !");
            return;
        }

        var course = FirebaseCoursesModule.getCourse(lastCheckedCourse);
        txtCourseToDelete.value = course.name;
        dialogDeleteCourse.showModal();
    }

    function doDeleteCourse() {
        'use strict';

        var name = txtCourseToDelete.value;
        console.log("[Html] > doDeleteCourse: " + name);

        FirebaseCoursesModule.deleteCourse(name)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Deleted Course '" + name + "' from Repository [Key = " + key + "]!";
                return key;
            }).then((key) => {
                return updateTableOfCourses(true, false);
            }).catch((msg) => {
                console.log("Error in doDeleteCourse");
                // log error to status bar
                txtStatusBar.value = msg;
            }).finally(() => {
                txtCourseToDelete.value = '';
                lastCheckedCourse = -1;
                dialogDeleteCourse.close();
                console.log("[Html] < doDeleteCourse");
            });
    }

    function cancelDeleteCourse() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedCourse);
        checkboxLabel.MaterialCheckbox.uncheck();
        lastCheckedCourse = -1;
        dialogDeleteCourse.close();
    }

    // ============================================================================================
    // create list of courses (synchronously)- using promises

    function onRefreshCourse() {
        updateTableOfCourses(true, true);
    }

    function updateTableOfCourses(checkGuard, verbose) {
        'use strict';
        if (checkGuard && isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("[Html] > updateTableOfCourses");

        tableCoursesBody.innerHTML = '';
        return FirebaseCoursesModule.getCourses().then((listOfCourses) => {
            for (var i = 0; i < listOfCourses.length; i++) {
                var course = listOfCourses[i]
                addEntryToCourseTable(tableCoursesBody, i, course);
            }
            return listOfCourses.length;
        }).then((number) => {
            if (verbose) {
                // refresh status line
                txtStatusBar.value = number + ' courses';
            }
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            isActive = false;
            console.log("[Html] < updateTableOfCourses");
        });
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
        updateTableOfCourses: updateTableOfCourses
    };
})();