var HtmlTabQuestionsAdminModule = (function () {

    // retrieve HTML elements according to 'questions administrations' tab
    var tabQuestionsAdmin = document.getElementById('#questions-panel-admin');
    var dialogCreateQuestion = document.getElementById('dialogCreateQuestion');
    var btnEnterQuestion = document.getElementById('btnEnterQuestion');
    var textareaQuestion = document.getElementById('textareaQuestion');
    var divAnchorAnswers = document.getElementById('divAnchorAnswers');
    var divAnchorCorrectAnswers = document.getElementById('divAnchorCorrectAnswers');
    var labelNumAnswers = document.getElementById('labelNumAnswers');
    var listItem2 = document.getElementById('list-num-answers-2');
    var listItem3 = document.getElementById('list-num-answers-3');
    var listItem4 = document.getElementById('list-num-answers-4');
    var listItem5 = document.getElementById('list-num-answers-5');
    var listItem6 = document.getElementById('list-num-answers-6');
    var listItem7 = document.getElementById('list-num-answers-7');
    var listItem8 = document.getElementById('list-num-answers-8');
    var listItem9 = document.getElementById('list-num-answers-9');
    var menuSubjects = document.getElementById('menuSubjects');
    var textfieldCurrentSubject = document.getElementById('textfieldCurrentSubject');

    // miscellaneous data
    var numAnswers;      // needed for 'create question' dialog
    var currentSubject;  // needed to assign question input to this subject (admin)

    // ============================================================================================
    // initialization

    function init() {
        // questions
        numAnswers = 2;

        currentSubject = null;

        // connect ui elements with event handlers
        bindUIActions();
    };
    
    function bindUIActions() {
        'use strict';
        if (!dialogCreateQuestion.showModal) {
            dialogPolyfill.registerDialog(dialogCreateQuestion);
        }

        btnEnterQuestion.addEventListener('click', () => {
            'use strict';
            onCreateQuestion();
        });

        dialogCreateQuestion.querySelector('.create_question').addEventListener('click', () => {
            'use strict';
            doCreateQuestion();
        });

        dialogCreateQuestion.querySelector('.cancel_question').addEventListener('click', () => {
            'use strict';
            cancelCreateQuestion();
        });

        listItem2.addEventListener('click', helperDialogDisplay(2));
        listItem3.addEventListener('click', helperDialogDisplay(3));
        listItem4.addEventListener('click', helperDialogDisplay(4));
        listItem5.addEventListener('click', helperDialogDisplay(5));
        listItem6.addEventListener('click', helperDialogDisplay(6));
        listItem7.addEventListener('click', helperDialogDisplay(7));
        listItem8.addEventListener('click', helperDialogDisplay(8));
        listItem9.addEventListener('click', helperDialogDisplay(9));

        createAnswersList(numAnswers, divAnchorAnswers);
        createAnswersToCheckboxesList(numAnswers, divAnchorCorrectAnswers);

        tabQuestionsAdmin.addEventListener('click', () => {
            'use strict';
            onLoadListOfSubjectsAdmin();
        });
    };

    function helperDialogDisplay(number) {
        'use strict';
        // note: the outer function returns an inner function, the variable 'number' is part of the closure (!)
        return function () {
            if (numAnswers != number) {
                numAnswers = number;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        }
    }

    /*
     *  create single question
     */

    function onCreateQuestion() {
        'use strict';
        if (currentSubject === null) {
            alert("Please choose subject !");
            return;
        }

        dialogCreateQuestion.showModal();
    }

    function doCreateQuestion() {
        'use strict';
        addQuestion();
        dialogCreateQuestion.close();
        clearDialog();
    }

    function cancelCreateQuestion() {
        'use strict';
        dialogCreateQuestion.close();
    }

    function createAnswersList(number, outerDiv) {
        'use strict';
        outerDiv.innerHTML = '';
        for (var i = 0; i < number; i++) {

            var divOuterNode = document.createElement('div');           // create outer <div> node
            var divInnerNode = document.createElement('div');           // create inner <div> node

            divInnerNode.setAttribute('class', 'mdl-textfield mdl-js-textfield');      // set attribute
            var textareaNode = document.createElement('textarea');      // create inner <textarea> node
            textareaNode.setAttribute('class', 'mdl-textfield__input'); // set attribute
            textareaNode.setAttribute('type', 'text');                  // set attribute
            textareaNode.setAttribute('rows', '1');                     // set attribute
            textareaNode.setAttribute('id', 'answer' + (i + 1));        // set attribute

            var labelNode = document.createElement('label');            // create inner <label> node
            labelNode.setAttribute('class', 'mdl-textfield__label');    // set attribute
            labelNode.setAttribute('for', 'answer' + (i + 1));          // set attribute

            var textnode = document.createTextNode('...');  // create inner text node
            labelNode.appendChild(textnode);                // append text to <label>
            divInnerNode.appendChild(textareaNode);  // append <textarea> to <div>
            divInnerNode.appendChild(labelNode);     // append <label> to <div>
            divOuterNode.appendChild(divInnerNode);  // append inner <div> to outer <div> node
            outerDiv.appendChild(divOuterNode);      // append outer <div> node to anchor <div> node
        }

        componentHandler.upgradeDom();
    }

    function createAnswersToCheckboxesList(number, outerDiv) {
        'use strict';
        outerDiv.innerHTML = '';
        for (var i = 0; i < number; i++) {

            var label = document.createElement('label');      // create <label> node
            label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect');
            label.setAttribute('for', 'for-id-' + (i + 1));

            var input = document.createElement('input');      // create <input> node
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', 'for-id-' + (i + 1));
            input.setAttribute('class', 'mdl-checkbox__input');

            var span = document.createElement('span');        // create <span> node
            span.setAttribute('class', 'mdl-checkbox__label');

            var textnode = document.createTextNode('Antwort ' + (i + 1));  // create inner text node

            span.appendChild(textnode);     // append text to <span> node
            label.appendChild(input);       // append <input> to <label>
            label.appendChild(span);        // append <span> to <label>
            outerDiv.appendChild(label);    // append <label> to outer <div> node
        }

        componentHandler.upgradeDom();
    }

    function updateNumAnswersDisplay(number, label) {
        'use strict';
        label.innerHTML = '';
        var textnode = document.createTextNode('' + number);  // create new text node
        label.appendChild(textnode);  // insert text into <label> node
    }

    function updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers) {
        'use strict';
        updateNumAnswersDisplay(numAnswers, labelNumAnswers);
        createAnswersList(numAnswers, divAnchorAnswers);
        createAnswersToCheckboxesList(numAnswers, divAnchorCorrectAnswers);
    }

    // ============================================================================================
    // private helper functions (administration)

    function addQuestion() {
        'use strict';
        var question = textareaQuestion.value;
        if (question === "") {
            window.alert("Empty Question !");
            return;
        }

        var answers = [];
        var childrenAnswers = divAnchorAnswers.getElementsByTagName('textarea');
        for (var i = 0; i < childrenAnswers.length; i++) {
            answers.push(childrenAnswers[i].value);
        }

        var correctAnswers = [];
        var numCorrectAnswers = 0;
        var childrenCorrectAnswers = divAnchorCorrectAnswers.getElementsByClassName('mdl-checkbox');
        for (var i = 0; i < childrenCorrectAnswers.length; i++) {

            var label = childrenCorrectAnswers[i];
            var classAttributes = label.getAttribute("class");
            var result = classAttributes.includes('is-checked');

            if (result === true) {
                numCorrectAnswers++;
                correctAnswers.push(true);
            } else {
                correctAnswers.push(false);
            }
        }

        // assertion: lists must have same size
        if (answers.length != correctAnswers.length) {
            window.alert("Internal Error: Lists of answers and their solutions have different size !");
        }

        FirebaseQuestionsModule.addQuestion(question, currentSubject.key, answers, correctAnswers);
    }

    function clearDialog() {
        'use strict';
        textareaQuestion.value = '';
        numAnswers = 2;
        updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
    }

        // ============================================================================================
    // private helper functions (ui - subjects menu - admin tab)  

    function onLoadListOfSubjectsAdmin() {
        'use strict';
        FirebaseSubjectsModule.readListOfSubjects(addMenuEntry, doneMenu);
    }

    function addMenuEntry(subject) {
        'use strict';

        // <li>
        //     <p class="mdl-menu__item">Subject</p>
        // </li>

        var listitem = document.createElement('li');   // create <li> node
        var para = document.createElement('p');        // create <p> node
        para.setAttribute('class', 'mdl-menu__item');  // set attribute
        var textnode = document.createTextNode(subject.name);  // create text node
        para.appendChild(textnode);          // append text to <p>
        listitem.appendChild(para);          // append <p> to <li>
        menuSubjects.appendChild(listitem);  // append <li> to <ul>

        listitem.addEventListener('click', () => {
            'use strict';
            // retrieving selected subject from closure
            currentSubject = subject;
            textfieldCurrentSubject.value = currentSubject.name;
        });
    }

    function doneMenu() {
        'use strict';
        componentHandler.upgradeDom();
    }

    // ============================================================================================
    // public functions

    return {
        init: init
    };

})();
