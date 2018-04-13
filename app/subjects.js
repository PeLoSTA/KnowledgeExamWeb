var SubjectsModule = (function () {

    // retrieve HTML elements according to 'subjects' tab
    var btnList = document.getElementById('btnList');
    var btnCreate = document.getElementById('btnCreate');
    var btnModify = document.getElementById('btnModify');
    var btnDelete = document.getElementById('btnDelete');
    var tableSubjectsBody = document.getElementById('tableSubjectsBody');
    var dialogCreate = document.getElementById('dialogCreate');
    var dialogModify = document.getElementById('dialogModify');
    var dialogDelete = document.getElementById('dialogDelete');
    var txtSubject = document.getElementById('txtSubject');
    var txtDescription = document.getElementById('txtDescription');
    var txtSubjectModified = document.getElementById('txtSubjectModified');
    var txtDescriptionModified = document.getElementById('txtDescriptionModified');
    var txtSubjectToDelete = document.getElementById('txtSubjectToDelete');

    var rowCounterSubjects;
    var lastCheckedSubject;
    var isActive;

    function init() {
        lastCheckedSubject = -1;
        isActive = false;
        bindUIActions();
    };

    function bindUIActions() {
        'use strict';
        if (!dialogCreate.showModal) {
            dialogPolyfill.registerDialog(dialogCreate);
        }
        if (!dialogDelete.showModal) {
            dialogPolyfill.registerDialog(dialogDelete);
        }

        btnList.addEventListener('click', () => {
            'use strict';
            updateTableOfSubjects();
        });

        btnCreate.addEventListener('click', () => {
            'use strict';
            onCreateEvent();
        });

        btnModify.addEventListener('click', () => {
            'use strict';
            onModifyEvent();
        });

        btnDelete.addEventListener('click', () => {
            'use strict';
            onDeleteEvent();
        });

        dialogCreate.querySelector('.create').addEventListener('click', () => {
            'use strict';
            doCreateEvent();
        });

        dialogCreate.querySelector('.cancel_create').addEventListener('click', () => {
            'use strict';
            cancelCreateEvent();
        });

        dialogModify.querySelector('.modify').addEventListener('click', () => {
            'use strict';
            doModifyEvent();
        });

        dialogModify.querySelector('.cancel_modify').addEventListener('click', () => {
            'use strict';
            cancelModifyEvent();
        });

        dialogDelete.querySelector('.delete').addEventListener('click', () => {
            'use strict';
            doDeleteEvent();
        });

        dialogDelete.querySelector('.cancel_delete').addEventListener('click', () => {
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

    /*
     *  reading list of subjects asynchronously
     */

    function updateTableOfSubjects() {
        'use strict';
        updateTableOfSubjectsBegin();
        FirebaseModule.readListOfSubjects(updateTableOfSubjectsNext, updateTableOfSubjectsDone);
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
     *  create new subject
     */

    function onCreateEvent() {
        dialogCreate.showModal();
    }

    function doCreateEvent() {
        'use strict';
        var name = txtSubject.value;
        var description = txtDescription.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");

        }
        else {
            FirebaseModule.addSubject(name, description);
            updateTableOfSubjects();
        }

        txtSubject.value = '';
        txtDescription.value = '';
        dialogCreate.close();
    }

    function cancelCreateEvent() {
        'use strict';
        txtSubject.value = '';
        txtDescription.value = '';
        lastCheckedSubject = -1;
        dialogCreate.close();
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

        var subject = FirebaseModule.getSubject(lastCheckedSubject - 1);
        txtSubjectModified.value = subject.name;
        txtDescriptionModified.value = subject.description;
        dialogModify.showModal();
    }

    function doModifyEvent() {
        'use strict';
        var name = txtSubjectModified.value;
        var description = txtDescriptionModified.value;

        if (subject === '' || description === '') {
            window.alert("Name or Description field emtpy !");
        }
        else {
            var subject = FirebaseModule.getSubject(lastCheckedSubject - 1);
            subject.name = name;
            subject.description = description;
            FirebaseModule.updateSubject(subject);
            updateTableOfSubjects();
        }

        txtSubjectModified.value = '';
        txtDescriptionModified.value = '';
        dialogModify.close();
    }

    function cancelModifyEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedSubject);
        checkboxLabel.MaterialCheckbox.uncheck();
        txtSubjectModified.value = '';
        txtDescriptionModified.value = '';
        lastCheckedSubject = -1;
        dialogModify.close();
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

        var subject = FirebaseModule.getSubject(lastCheckedSubject - 1);
        txtSubjectToDelete.value = subject.name;
        dialogDelete.showModal();
    }

    function doDeleteEvent() {
        'use strict';
        console.log("Subject to delete: " + txtSubjectToDelete.value);
        FirebaseModule.deleteSubject(txtSubjectToDelete.value);
        txtSubjectToDelete.value = '';
        dialogDelete.close();

        updateTableOfSubjectsBegin();
        FirebaseModule.readListOfSubjects(updateTableOfSubjectsNext, updateTableOfSubjectsDone);
    }

    function cancelDeleteEvent() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedSubject);
        checkboxLabel.MaterialCheckbox.uncheck();
        lastCheckedSubject = -1;
        dialogDelete.close();
    }

    // ============================================================================================
    // private helper functions

    function addEntryToSubjectTable(entry) {
        'use strict';

        // adding dynamically a 'material design lite' node to a table, for example
        //
        //  <tr>
        //      <td>
        //          <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //              <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //          </label>
        //      </td>
        //      <td class="mdl-data-table__cell--non-numeric">C++</td>
        //      <td class="mdl-data-table__cell--non-numeric">Beyond C</td>
        //  </tr>

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node

        var label = document.createElement('label');     // create <label> node
        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attributes
        label.setAttribute('for', 'row_' + rowCounterSubjects);  // set attributes
        label.setAttribute('id', 'label_' + rowCounterSubjects);  // set attributes
        var input = document.createElement('input');     // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input');  // set attributes
        input.setAttribute('type', 'checkbox');  // set attributes
        input.setAttribute('id', 'row_' + rowCounterSubjects);  // set attributes
        input.addEventListener('click', checkboxHandler);
        rowCounterSubjects++;

        label.appendChild(input);
        td1.appendChild(label);

        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attributes
        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attributes
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
            var boxes = document.getElementsByClassName('mdl-checkbox');
            for (var k = 0; k < boxes.length; k++) {

                if (k != lastCheckedSubject - 1) {
                    var label = boxes[k];
                    label.MaterialCheckbox.uncheck();
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
        updateTableOfSubjects: updateTableOfSubjects
    };
})();