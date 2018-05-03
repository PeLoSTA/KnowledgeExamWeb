/*global dialogPolyfill */
/*global FirebaseClassesModule */

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
                    // updateTableOfClassesPr();
                }).catch((msg) => {
                    console.log('ccc');
                    txtStatusBar.value = msg;
                }).finally(() => {
                    console.log('xxxxxxxxxxxxxxxxxxxxxx');

                    txtClassName.value = '';
                    txtClassDescription.value = '';
                    dialogCreateClass.close();
                });
        }

        console.log('ddd');

        // txtClassName.value = '';
        // txtClassDescription.value = '';
        // dialogCreateClass.close();
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
        console.log('sdf fe sdf  sd sdf fds');
    }

    // ============================================================================================
    // delete existing class

    function onDeleteClass() {
        console.log('sdf fe sdf  sd sdf fds');
    }

    // ============================================================================================
    // update existing class

    function onUpdateClass() {
        console.log('sdf fe sdf  sd sdf fds');
    }

    // ============================================================================================
    // public interface

    return {
        init: init
    }

})();