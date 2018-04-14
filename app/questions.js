var HtmlQuestionsModule = (function () {

    // retrieve HTML elements according to 'questions' tab
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

    // miscellaneous data
    var numAnswers;

    // ============================================================================================
    // initialization

    function init() {
        // questions
        numAnswers = 2;

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

        // TODO: Das ganze irgendwie mit einem Array machen ... oder 7 Funktionen mit veschiedenem Closure !!!
        listItem2.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 2) {
                numAnswers = 2;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        listItem3.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 3) {
                numAnswers = 3;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        listItem4.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 4) {
                numAnswers = 4;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        listItem5.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 5) {
                numAnswers = 5;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        listItem6.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 6) {
                numAnswers = 6;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        listItem7.addEventListener('click', () => {

            'use strict';
            if (numAnswers != 7) {
                numAnswers = 7;
                updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
            }
        });

        createAnswersList(numAnswers, divAnchorAnswers);
        createAnswersToCheckboxesList(numAnswers, divAnchorCorrectAnswers);
    };

    // ============================================================================================
    // questions

    function onCreateQuestion() {
        'use strict';
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

            divInnerNode.setAttribute('class', 'mdl-textfield mdl-js-textfield');
            var textareaNode = document.createElement('textarea');      // create inner <textarea> node
            textareaNode.setAttribute('class', 'mdl-textfield__input');
            textareaNode.setAttribute('type', 'text');
            textareaNode.setAttribute('rows', '1');
            textareaNode.setAttribute('id', 'answer' + (i + 1));

            var labelNode = document.createElement('label');            // create inner <label> node
            labelNode.setAttribute('class', 'mdl-textfield__label');
            labelNode.setAttribute('for', 'answer' + (i + 1));

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
    // private helper functions

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

        FirebaseQuestionsModule.addQuestion(question, answers, correctAnswers);
    }

    function clearDialog() {
        'use strict';
        textareaQuestion.value = '';
        numAnswers = 2;
        updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
    }

    // ============================================================================================
    // public functions

    return {
        init: init,
    };
})();