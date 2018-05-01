var HtmlTabStudentsModule = (function () {

    // retrieve HTML elements according to 'students' tab
    var btnCreateStudent = document.getElementById('btnCreateStudent');
    var btnModifyStudent = document.getElementById('btnModifyStudent');
    var btnDeleteStudent = document.getElementById('btnDeleteStudent');
    var btnRefreshStudents = document.getElementById('btnRefreshStudents');

    var selectStudentsSubjects = document.getElementById('selectStudentsSubjects');

    // ============================================================================================
    // initialization

    function init() {
        'use strict';
        bindUIActions();
    }

    function bindUIActions() {
        'use strict';
        btnCreateStudent.addEventListener('click', onClickEvent);
        btnModifyStudent.addEventListener('click', onClickEvent);
        btnDeleteStudent.addEventListener('click', onClickEvent);
        btnRefreshStudents.addEventListener('click', onClickEvent);

        selectStudentsSubjects.addEventListener ('change', onChangeEvent);
    }

    // ============================================================================================
    // click event dispatching routine

    function onChangeEvent() {
        'use strict';
        var sender = this.id

        console.log("select ...  value == " + this.value);

        let options = selectStudentsSubjects.querySelectorAll('option');
        let count = options.length;
        if (typeof count == 'undefined') {
            console.log("arghhhhhhhhh ....");
        }
    }

    function onClickEvent() {
        'use strict';
        var sender = this.id;

        switch (sender) {
            case "btnCreateStudent":
                onCreateEvent();
                break;
            // case "btnModifySubject":
            //     onModifyEvent();
            //     break;
            // case "btnDeleteSubject":
            //     onDeleteEvent();
            //     break;
            // case "btnRefreshSubjects":
            //     onRefreshEvent();
            //     break;
        }
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

    // ============================================================================================
    // public interface

    return {
        init: init
    }
})();