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

    var dialogCreateClass = document.getElementById('dialogCreateClass');
    var dialogModifyClass = document.getElementById('dialogModifyClass');
    var dialogDeleteClass = document.getElementById('dialogDeleteClass');

    var tableClassesBody = document.getElementById('tableClassesBody');

    var txtStatusBar = document.getElementById('status_bar');

    // miscellaneous data
    var lastCheckedClass;
    var isActive;

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
        // if (!dialogModifyClass.showModal) {
        //     dialogPolyfill.registerDialog(dialogModifyClass);
        // }
        // if (!dialogDeleteClass.showModal) {
        //     dialogPolyfill.registerDialog(dialogDeleteClass);
        // }

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
        }
        else {
            FirebaseClassesModule.addClass(name, description)
                .then((key) => {
                    console.log('aaa');
                    // add key to status line
                    txtStatusBar.value = "Added Class '" + name + "' to repository [Key = " + key + "]!";
                    return key;
                }).then((key) => {
                    console.log('bbb [' + key + ']');
                    updateTableOfClassesPr();
                }).catch((msg) => {
                    console.log('ccc');
                    txtStatusBar.value = msg;
                }).finally(() => {
                    txtClassName.value = '';
                    txtClassDescription.value = '';
                    dialogCreateClass.close();
                });
        }
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
        console.log('ToDo');
    }

    // ============================================================================================
    // delete existing class

    function onDeleteClass() {
        console.log('ToDo');
    }

    // ============================================================================================
    // update existing class

    function onUpdateClass() {
        updateTableOfClassesPr();
    }

    function updateTableOfClassesPr() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("updateTableOfClassesPr");

        tableClassesBody.innerHTML = '';
        FirebaseClassesModule.getClassesPr().then((listOfClasses) => {
            for (var i = 0; i < listOfClasses.length; i++) {
                var course = listOfClasses[i]
                console.log("    ===> " + course.name);
                addEntryToClassTable(tableClassesBody, i, course);
            }
        }).catch((err) => {
            console.log('Reading list of courses failed !!!!!!!!!!!!!');
            console.log('    ' + err);
        }).finally(() => {
            isActive = false;
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
        //      <td class="mdl-data-table__cell--non-numeric">Beyond C</td>
        //  </tr>

        var node = document.createElement('tr');      // create <tr> node
        var td1 = document.createElement('td');       // create first <td> node
        var label = document.createElement('label');  // create <label> node

        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attribute
        label.setAttribute('for', 'row_' + index);    // set attribute
        label.setAttribute('id', 'label_' + index);   // set attribute
        var input = document.createElement('input');  // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input checkbox_select_class');  // set attribute
        input.setAttribute('type', 'checkbox');       // set attributes
        input.setAttribute('id', 'row_' + index);     // set attribute
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
        console.log('clicked at checkbox: ' + this.id + '[checkbox is checked: ' + this.checked + ' ]');

        // calculate index of row
        var row = parseInt(this.id.substring(4));  // omitting 'row_'

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
        init: init
    }

})();