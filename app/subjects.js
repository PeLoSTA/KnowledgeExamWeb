var SubjectsModule = (function () {

    // retrieve HTML elements according to 'subjects' tab
    var btnList = document.getElementById('btnList');
    var btnCreate = document.getElementById('btnCreate');
    var btnDelete = document.getElementById('btnModify');
    var btnDelete = document.getElementById('btnDelete');
    var tableSubjectsBody = document.getElementById('tableSubjectsBody');
    var dialogCreate = document.getElementById('dialogCreation');
    if (!dialogCreate.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    var rowCounterSubjects;
    var lastCheckedSubject;

    function init() {
        lastCheckedSubject = '';
        bindUIActions();
    };

    function bindUIActions() {
        'use strict';
        btnList.addEventListener('click', () => {

            updateTableOfSubjectsBegin();
            FirebaseModule.readListOfSubjects(callback);
        });

        btnCreate.addEventListener('click', () => {
            'use strict';
            dialogCreate.showModal();
        });

        dialogCreate.querySelector('.create').addEventListener('click', () => {

            var subject = txtSubject.value;
            var description = txtDescription.value;

            console.log("Subject: " + txtSubject.value);
            console.log("Description: " + txtDescription.value);

            FirebaseModule.addSubject(subject, description);

            txtSubject.value = '';
            txtDescription.value = '';

            dialogCreate.close();
        });

        dialogCreate.querySelector('.cancel').addEventListener('click', () => {

            dialogCreate.close();
        });

        // Funktioniert -- aber ich will das lieber mit checkboxes lösen
        // tableSubjectsBody.onclick = function (ev) {
        //     // ev.target <== td element
        //     // ev.target.parentElement <== tr
        //     var index = ev.target.parentElement.rowIndex;

        //     console.log('Yeahhhhhhhh: ' + index);
        // }
    };

    function callback(subject) {
        'use strict';
        updateTableOfSubjectsNext(subject);
    };

    function updateTableOfSubjectsBegin() {
        'use strict';
        console.log("updateTableOfSubjectsBegin");
        rowCounterSubjects = 1;
        tableSubjectsBody.innerHTML = '';
        componentHandler.upgradeDom();
    }

    function updateTableOfSubjectsNext(entry) {
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
    }

    // Erste Version -- zum Ausprobieren .....
    // function checkboxHandler() {
    //     'use strict';
    //     console.log('id:      ' + this.id);
    //     console.log('checked: ' + this.checked);

    //     // uncheck all other check boxes - ignore unchecking

    //     if (lastCheckedSubject === '') {

    //         lastCheckedSubject = this.id;
    //     }
    //     else {

    //         // TODO: Da fehlt die Hierarchie: Alle unterhalb der Tabelle ...
    //         var boxes = document.getElementsByClassName('mdl-checkbox__input');

    //         for (var k = 0; k < boxes.length; k++) {

    //             if (boxes[k].checked) {
    //                 console.log('   box:      ' + boxes[k].id);
    //             }
    //         }
    //     }
    // };

    function checkboxHandler() {
        'use strict';
        console.log('id:      ' + this.id);
        console.log('checked: ' + this.checked);

        // uncheck all other check boxes - ignore unchecking
        if (!this.checked) {
            return;
        }

        lastCheckedSubject = this.id;

        // TODO: Da fehlt die Hierarchie: Alle unterhalb der Tabelle ...
        var boxes = document.getElementsByClassName('mdl-checkbox__input');

        for (var k = 0; k < boxes.length; k++) {

            if (boxes[k].id !== this.id) {
                console.log('    setting at ' + k + " to zero ....");
                boxes[k].checked = false;
            }
        }

        // componentHandler.upgradeDom();   // eher nicht, die HTML widgekt sind schon sichtbar 

        // for (var k = 0; k < boxes.length; k++) {

        //     if (boxes[k].checked) {

        //         if (boxes[k].id !== lastCheckedSubject) {
        //             boxes[k].checked = false;
        //         }
        //     }
        // }
    };

    return {
        init: init,
        updateTableOfSubjectsBegin: updateTableOfSubjectsBegin,
        updateTableOfSubjectsNext: updateTableOfSubjectsNext
    };
})();