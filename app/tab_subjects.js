var HtmlTabSubjectsModule = (function () {

    // retrieve HTML elements according to 'subjects' tab
    var btnCreate = document.getElementById('btnCreate');
    var btnModify = document.getElementById('btnModify');
    var btnDelete = document.getElementById('btnDelete');
    var btnRefresh = document.getElementById('btnRefresh');
    var tableSubjectsBody = document.getElementById('tableSubjectsBody');
    var dialogCreateSubject = document.getElementById('dialogCreateSubject');
    var dialogModifySubject = document.getElementById('dialogModifySubject');
    var dialogDeleteSubject = document.getElementById('dialogDeleteSubject');

    var txtSubject = document.getElementById('txtSubject');
    var txtDescription = document.getElementById('txtDescription');
    var txtSubjectModified = document.getElementById('txtSubjectModified');
    var txtDescriptionModified = document.getElementById('txtDescriptionModified');
    var txtSubjectToDelete = document.getElementById('txtSubjectToDelete');

    // miscellaneous data
    var rowCounterSubjects;
    var lastCheckedSubject;
    var isActive;

    // ============================================================================================
    // initialization

    function init() {
        // subjects
        lastCheckedSubject = -1;
        isActive = false;

        // connect ui elements with event handlers
        bindUIActions();
    };

    function bindUIActions() {
        'use strict';
        if (!dialogCreateSubject.showModal) {
            dialogPolyfill.registerDialog(dialogCreateSubject);
        }
        if (!dialogDeleteSubject.showModal) {
            dialogPolyfill.registerDialog(dialogDeleteSubject);
        }

        btnCreate.addEventListener('click', onClickEvent);
        btnModify.addEventListener('click', onClickEvent);
        btnDelete.addEventListener('click', onClickEvent);
        btnRefresh.addEventListener('click', onClickEvent);

        dialogCreateSubject.querySelector('.create').addEventListener('click', () => {
            'use strict';
            doCreateEvent();
        });

        dialogCreateSubject.querySelector('.cancel_create').addEventListener('click', () => {
            'use strict';
            cancelCreateEvent();
        });

        dialogModifySubject.querySelector('.modify').addEventListener('click', () => {
            'use strict';
            doModifyEvent();
        });

        dialogModifySubject.querySelector('.cancel_modify').addEventListener('click', () => {
            'use strict';
            cancelModifyEvent();
        });

        dialogDeleteSubject.querySelector('.delete').addEventListener('click', () => {
            'use strict';
            doDeleteEvent();
        });

        dialogDeleteSubject.querySelector('.cancel_delete').addEventListener('click', () => {
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
    };

    // ============================================================================================
    // click event dispatching routine

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreate":
                onCreateEvent();
                break;
            case "btnModify":
                onModifyEvent();
                break;
            case "btnDelete":
                onDeleteEvent();
                break;
            case "btnRefresh":
                onRefreshEvent();
                break;
        }
    };


    // ============================================================================================
    // subjects

    /*
     *  reading list of subjects (asynchronously) - using callbacks
     */

    function onRefreshEvent() {
        'use strict';
        updateTableOfSubjects();
    };

    function updateTableOfSubjects() {
        'use strict';
        updateTableOfSubjectsBegin();
        FirebaseSubjectsModule.readListOfSubjects(updateTableOfSubjectsNext, updateTableOfSubjectsDone);
    };

    function updateTableOfSubjectsBegin() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("updateTableOfSubjectsBegin");
        rowCounterSubjects = 1;
        lastCheckedSubject = -1;
        tableSubjectsBody.innerHTML = '';
        componentHandler.upgradeDom();
    };

    function updateTableOfSubjectsNext(subject) {
        'use strict';
        addEntryToSubjectTable(subject);
    };

    function updateTableOfSubjectsDone() {
        'use strict';
        isActive = false;
    }

    /*
     *  reading list of subjects (synchronously)- using promises
     */

    function updateTableOfSubjects_P() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("updateTableOfSubjectsBegin");
        rowCounterSubjects = 1;
        lastCheckedSubject = -1;
        tableSubjectsBody.innerHTML = '';

        FirebaseSubjectsModule.readListOfSubjects_P().then(function (fromResolve) {
            for (var i = 0; i < fromResolve.length; i++) {
                var subject = fromResolve[i]
                console.log("    ===> " + subject.name);
                addEntryToSubjectTable(subject);
            }

        }).catch(function () {
            console.log('Reading list of subjects failed !!!!!!!!!!!!!');

            isActive = false;
        });

        isActive = false;
    };

    /*
     *  create new subject
     */

    function onCreateEvent() {
        dialogCreateSubject.showModal();
    }

    function doCreateEvent() {
        'use strict';
        var name = txtSubject.value;
        var description = txtDescription.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");

        }
        else {
            FirebaseSubjectsModule.addSubject(name, description);
            updateTableOfSubjects();
        }

        txtSubject.value = '';
        txtDescription.value = '';
        dialogCreateSubject.close();
    }

    function cancelCreateEvent() {
        'use strict';
        txtSubject.value = '';
        txtDescription.value = '';
        lastCheckedSubject = -1;
        dialogCreateSubject.close();
    }

    /*
     *  modify existing subject
     */

    function onModifyEvent() {
        'use strict';
        if (lastCheckedSubject === -1) {

            console.log("Warning: No subject selected !");
            return;
        }

        var subject = FirebaseSubjectsModule.getSubject(lastCheckedSubject - 1);
        txtSubjectModified.value = subject.name;
        txtDescriptionModified.value = subject.description;
        dialogModifySubject.showModal();
    }

    function doModifyEvent() {
        'use strict';
        var name = txtSubjectModified.value;
        var description = txtDescriptionModified.value;

        if (subject === '' || description === '') {
            window.alert("Name or Description field emtpy !");
        }
        else {
            var subject = FirebaseSubjectsModule.getSubject(lastCheckedSubject - 1);
            subject.name = name;
            subject.description = description;
            FirebaseSubjectsModule.updateSubject(subject);
            updateTableOfSubjects();
        }

        txtSubjectModified.value = '';
        txtDescriptionModified.value = '';
        dialogModifySubject.close();
    }

    function cancelModifyEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedSubject);
        checkboxLabel.MaterialCheckbox.uncheck();
        txtSubjectModified.value = '';
        txtDescriptionModified.value = '';
        lastCheckedSubject = -1;
        dialogModifySubject.close();
    }

    /*
     *  delete existing subject
     */

    function onDeleteEvent() {
        'use strict';
        if (lastCheckedSubject === -1) {

            console.log("Warning: No subject selected !");
            return;
        }

        var subject = FirebaseSubjectsModule.getSubject(lastCheckedSubject - 1);
        txtSubjectToDelete.value = subject.name;
        dialogDeleteSubject.showModal();
    }

    function doDeleteEvent() {
        'use strict';
        console.log("Subject to delete: " + txtSubjectToDelete.value);
        FirebaseSubjectsModule.deleteSubject(txtSubjectToDelete.value);
        txtSubjectToDelete.value = '';
        dialogDeleteSubject.close();

        updateTableOfSubjectsBegin();
        FirebaseSubjectsModule.readListOfSubjects(updateTableOfSubjectsNext, updateTableOfSubjectsDone);
    }

    function cancelDeleteEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedSubject);
        checkboxLabel.MaterialCheckbox.uncheck();
        lastCheckedSubject = -1;
        dialogDeleteSubject.close();
    }

    // ============================================================================================
    // private helper functions

    function addEntryToSubjectTable(entry) {
        'use strict';

        // adding dynamically a 'material design lite' node to a table, for example
        //
        //  <tr>
        //  <td>
        //      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //          <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //      </label>
        //  </td>
        //      <td class="mdl-data-table__cell--non-numeric">C++</td>
        //      <td class="mdl-data-table__cell--non-numeric">Beyond C</td>
        //  </tr>

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var label = document.createElement('label');     // create <label> node

        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attribute
        label.setAttribute('for', 'row_' + rowCounterSubjects);  // set attribute
        label.setAttribute('id', 'label_' + rowCounterSubjects);  // set attribute
        var input = document.createElement('input');     // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input checkbox_select_subject');  // set attribute
        input.setAttribute('type', 'checkbox');  // set attributes
        input.setAttribute('id', 'row_' + rowCounterSubjects);  // set attribute
        input.addEventListener('click', checkboxHandler);
        rowCounterSubjects++;
        label.appendChild(input);
        td1.appendChild(label);

        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        var textnode1 = document.createTextNode(entry.name);             // create second text node
        var textnode2 = document.createTextNode(entry.description);      // create third text node
        td2.appendChild(textnode1);                 // append text to <td>
        td3.appendChild(textnode2);                 // append text to <td>
        node.appendChild(td1);                      // append <td> to <tr>
        node.appendChild(td2);                      // append <td> to <tr>
        node.appendChild(td3);                      // append <td> to <tr>
        tableSubjectsBody.appendChild(node);        // append <tr> to <tbody>

        componentHandler.upgradeDom();
    };

    function checkboxHandler() {
        'use strict';
        console.log('clicked at checkbox: ' + this.id + '[checkbox is checked: ' + this.checked + ' ]');

        // calculate index of row
        var row = parseInt(this.id.substring(4));  // omitting 'row_'

        if (this.checked) {

            lastCheckedSubject = row;

            // TODO: Da fehlt die Hierarchie: Alle unterhalb von genau dieser Tabelle ...
            var boxes = document.getElementsByClassName('checkbox_select_subject');
            for (var k = 0; k < boxes.length; k++) {

                if (k != lastCheckedSubject - 1) {
                    var label = boxes[k];
                    label.parentElement.MaterialCheckbox.uncheck();
                }
            }
        }
        else {

            if (row === lastCheckedSubject) {

                // clear last selection
                lastCheckedSubject = -1;
            }
        }
    };

    // ============================================================================================
    // public functions

    return {
        init: init,
        updateTableOfSubjects: updateTableOfSubjects,

        updateTableOfSubjects_P: updateTableOfSubjects_P
    };
})();