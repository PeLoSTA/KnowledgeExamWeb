/*global dialogPolyfill */
/*global FirebaseClassesModule */
/*global componentHandler */

var HtmlTabClassesModule = (function () {

    // retrieve HTML elements according to 'Classes' tab
    var btnCreateClass = document.getElementById('btnCreateClass');
    var btnModifyClass = document.getElementById('btnModifyClass');
    var btnDeleteClass = document.getElementById('btnDeleteClass');
    var btnUpdateClass = document.getElementById('btnUpdateClass');

    var txtClassName = document.getElementById('txtClassName');
    var txtClassDescription = document.getElementById('txtClassDescription');

    var txtClassNameModified = document.getElementById('txtClassNameModified');
    var txtClassDescriptionModified = document.getElementById('txtClassDescriptionModified');
    
    var txtClassToDelete = document.getElementById('txtClassToDelete');

    var dialogCreateClass = document.getElementById('dialogCreateClass');
    var dialogModifyClass = document.getElementById('dialogModifyClass');
    var dialogDeleteClass = document.getElementById('dialogDeleteClass');

    var tableClassesBody = document.getElementById('tableClassesBody');

    var txtStatusBar = document.getElementById('status_bar');

    var tabClassesPanel = document.getElementById('#classes-panel');

    // miscellaneous data
    var lastCheckedClass;
    var isActive;

    const prefix_checkboxes = 'row_class_';

    // ============================================================================================
    // initialization

    function init() {
        // classes
        lastCheckedClass = -1;
        isActive = false;

        // connect ui elements with event handlers
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        if (!dialogCreateClass.showModal) {
            dialogPolyfill.registerDialog(dialogCreateClass);
        }
        if (!dialogModifyClass.showModal) {
            dialogPolyfill.registerDialog(dialogModifyClass);
        }
        if (!dialogDeleteClass.showModal) {
            dialogPolyfill.registerDialog(dialogDeleteClass);
        }

        btnCreateClass.addEventListener('click', onClickEvent);
        btnModifyClass.addEventListener('click', onClickEvent);
        btnDeleteClass.addEventListener('click', onClickEvent);
        btnUpdateClass.addEventListener('click', onClickEvent);

        dialogCreateClass.querySelector('.create_class').addEventListener('click', () => {
            'use strict';
            doCreateClass();
        });

        dialogCreateClass.querySelector('.cancel_create_class').addEventListener('click', () => {
            'use strict';
            cancelCreateClass();
        });

        dialogModifyClass.querySelector('.modify_class').addEventListener('click', () => {
            'use strict';
            doModifyClass();
        });

        dialogModifyClass.querySelector('.cancel_modify_class').addEventListener('click', () => {
            'use strict';
            cancelModifyClass();
        });

        dialogDeleteClass.querySelector('.delete_class').addEventListener('click', () => {
            'use strict';
            doDeleteClass();
        });

        dialogDeleteClass.querySelector('.cancel_delete_class').addEventListener('click', () => {
            'use strict';
            cancelDeleteClass();
        });

        tabClassesPanel.addEventListener('click', () => {
            'use strict';
            onUpdateClass();
        });
    }

    // ============================================================================================
    // click event dispatching routine

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateClass":
                onCreateClass();
                break;
            case "btnModifyClass":
                onModifyClass();
                break;
            case "btnDeleteClass":
                onDeleteClass();
                break;
            case "btnUpdateClass":
                onUpdateClass();
                break;
        }
    }

    // ============================================================================================
    // create new class

    function onCreateClass() {
        dialogCreateClass.showModal();
    }

    function doCreateClass() {
        'use strict';
        var name = txtClassName.value;
        var description = txtClassDescription.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
            return null;
        }

        if (isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > doCreateClass");

        FirebaseClassesModule.addClass(name, description)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Added Class '" + name + "' to Repository [Key = " + key + "]!";
                return key;
            }).then((key) => {
                return updateTableOfClasses(false, false);
            }).catch((msg) => {
                // log error message to status line
                txtStatusBar.value = msg;
            }).finally(() => {
                txtClassName.value = '';
                txtClassDescription.value = '';
                dialogCreateClass.close();

                isActive = false;
                console.log("[Html] < doCreateClass");
            });
    }

    function cancelCreateClass() {
        'use strict';
        txtClassName.value = '';
        txtClassDescription.value = '';
        lastCheckedClass = -1;
        dialogCreateClass.close();
    }

    // ============================================================================================
    // modify existing class

    function onModifyClass() {
        'use strict';
        if (lastCheckedClass === -1) {
            window.alert("Warning: No class selected !");
            return;
        }

        var classs = FirebaseClassesModule.getClass(lastCheckedClass);
        txtClassNameModified.value = classs.name;
        txtClassDescriptionModified.value = classs.description;
        dialogModifyClass.showModal();
    }

    function doModifyClass() {
        'use strict';
        var name = txtClassNameModified.value;
        var description = txtClassDescriptionModified.value;

        if (name === '' || description === '') {
            window.alert("Name or Description field emtpy !");
            return null;
        }

        if (isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > doModifyClass");

        var classs = FirebaseClassesModule.getClass(lastCheckedClass);
        classs.name = name;
        classs.description = description;

        FirebaseClassesModule.updateClass(classs)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Updated Class '" + name;
                return key;
            }).then((key) => {
                return updateTableOfClasses(false, false);
            }).catch((msg) => {
                // log error message to status line
                txtStatusBar.value = msg;
            }).finally(() => {
                // clear checkbox
                var checkboxLabel = document.getElementById('label_' + lastCheckedClass);
                checkboxLabel.MaterialCheckbox.uncheck();
                txtClassNameModified.value = '';
                txtClassDescriptionModified.value = '';
                lastCheckedClass = -1;
                dialogModifyClass.close();

                isActive = false;
                console.log("[Html] < doModifyClass");
            });
    }

    function cancelModifyClass() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedClass);
        checkboxLabel.MaterialCheckbox.uncheck();
        txtClassNameModified.value = '';
        txtClassDescriptionModified.value = '';
        lastCheckedClass = -1;
        dialogModifyClass.close();
    }

    // ============================================================================================
    // delete existing class

    // Note: 'double click' on delete button needn't to be handled 
    //   - second click runs on a not existing firebase path
    //   - Firebase doesn't complain about this ...

    function onDeleteClass() {
        'use strict';
        if (lastCheckedClass === -1) {
            window.alert("Warning: No class selected !");
            return;
        }

        var classs = FirebaseClassesModule.getClass(lastCheckedClass);
        txtClassToDelete.value = classs.name;
        dialogDeleteClass.showModal();
    }

    function doDeleteClass() {
        'use strict';

        var name = txtClassToDelete.value;
        console.log("[Html] > doDeleteClass: " + name);

        FirebaseClassesModule.deleteClass(name)
            .then((key) => {
                // log key to status bar
                txtStatusBar.value = "Deleted Class '" + name + "' from Repository [Key = " + key + "]!";
                return key;
            }).then((key) => {
                return updateTableOfClasses(true, false);
            }).catch((msg) => {
                console.log("Error in doDeleteClass");
                // log error to status bar
                txtStatusBar.value = msg;
            }).finally(() => {
                txtClassToDelete.value = '';
                dialogDeleteClass.close();
                console.log("[Html] < doDeleteClass");
            });
    }

    function cancelDeleteClass() {
        'use strict';
        // clear checkbox
        var checkboxLabel = document.getElementById('label_' + lastCheckedClass);
        checkboxLabel.MaterialCheckbox.uncheck();
        lastCheckedClass = -1;
        dialogDeleteClass.close();
    }

    // ============================================================================================
    // refresh registered classes

    function onUpdateClass() {
        updateTableOfClasses(true, true);
    }

    function updateTableOfClasses(checkGuard, verbose) {
        'use strict';
        if (checkGuard && isActive === true) {
            console.log("[Html] Another asynchronous invocation still pending ... ignoring click event!");
            return null;
        }

        isActive = true;
        console.log("[Html] > updateTableOfClasses");

        tableClassesBody.innerHTML = '';
        return FirebaseClassesModule.getClasses().then((listOfClasses) => {
            for (var i = 0; i < listOfClasses.length; i++) {
                var classs = listOfClasses[i]
                addEntryToClassTable(tableClassesBody, i, classs);
            }
            return listOfClasses.length;
        }).then((number) => {
            if (verbose) {
                // refresh status line
                txtStatusBar.value = number + ' classes';
            }
        }).catch((msg) => {
            // log error message to status line
            txtStatusBar.value = msg;
        }).finally(() => {
            isActive = false;

            console.log("[Html] < updateTableOfClasses");
        });
    }

    // ============================================================================================
    // private helper functions

    function addEntryToClassTable(tablebody, index, entry) {
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
        input.setAttribute('class', 'mdl-checkbox__input checkbox_select_class');  // set attribute
        input.setAttribute('type', 'checkbox');       // set attributes
        input.setAttribute('id', uniqueId);           // set attribute
        input.addEventListener('click', checkboxHandler);
        label.appendChild(input);
        td1.appendChild(label);

        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        var textnode1 = document.createTextNode(entry.name);             // create second text node
        var textnode2 = document.createTextNode(entry.description);      // create third text node
        td2.appendChild(textnode1);      // append text to <td>
        td3.appendChild(textnode2);      // append text to <td>
        node.appendChild(td1);           // append <td> to <tr>
        node.appendChild(td2);           // append <td> to <tr>
        node.appendChild(td3);           // append <td> to <tr>
        tablebody.appendChild(node);     // append <tr> to <tbody>

        componentHandler.upgradeDom();
    }

    function checkboxHandler() {
        'use strict';
        console.log('[Html] clicked at checkbox: ' + this.id + ' [checkbox is checked: ' + this.checked + ' ]');

        // calculate index of row
        var ofs = prefix_checkboxes.length;
        var row = parseInt(this.id.substring(ofs));  // omitting prefix 'row_class_'

        if (this.checked) {

            lastCheckedClass = row;

            var boxes = tableClassesBody.getElementsByClassName('checkbox_select_class');
            for (var k = 0; k < boxes.length; k++) {

                if (k != lastCheckedClass) {
                    var label = boxes[k];
                    label.parentElement.MaterialCheckbox.uncheck();
                }
            }
        }
        else {

            if (row === lastCheckedClass) {

                // clear last selection
                lastCheckedClass = -1;
            }
        }
    }

    // ============================================================================================
    // public interface

    return {
        init: init,
        updateTableOfClasses: updateTableOfClasses
    }

})();