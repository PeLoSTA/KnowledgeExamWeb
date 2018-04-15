var HtmlQuestionsModule = (function () {

    // retrieve HTML elements according to 'questions administrations' tab
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

    // retrieve HTML elements according to 'questions viewer' tab
    var tabQuestionsSurvey = document.getElementById('#questions-panel-survey');
    var tableQuestionsSurvey = document.getElementById('tableQuestionsSurvey');  // TODO: Wird das gebraucht ?????
    var tableQuestionsBody = document.getElementById('tableQuestionsBody');

    // miscellaneous data
    var numAnswers;
    var rowCounterQuestions;
    var isActive;

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

        tabQuestionsSurvey.addEventListener('click', () => {
            'use strict';
            onLoadQuestionsSurvey();
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

    // ============================================================================================
    // questions

    /*
     *  reading list of questions asynchronously
     */

    function onLoadQuestionsSurvey() {
        'use strict';
        console.log("onLoadQuestionsSurvey");
        updateTableOfQuestions();
    }

    function updateTableOfQuestions() {
        'use strict';
        updateTableOfQuestionsBegin();
        FirebaseQuestionsModule.readListOfQuestions(updateTableOfQuestionsNext, updateTableOfQuestionsDone);
    };

    function updateTableOfQuestionsBegin() {
        'use strict';
        if (isActive === true) {
            console.log("Another asynchronous invocation still pending ... just ignoring click event!");
            return;
        }

        isActive = true;
        console.log("updateTableOfQuestionsBegin");
        rowCounterQuestions = 1;
        // lastCheckedSubject = -1;
        tableQuestionsBody.innerHTML = '';
        componentHandler.upgradeDom();
    };

    function updateTableOfQuestionsNext(counter, question) {
        'use strict';
        addEntryToQuestionsTable(counter, question);
    };

    function updateTableOfQuestionsDone() {
        'use strict';
        isActive = false;
        console.log('done................................');
    }

    /*
     *  create single question
     */

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

        FirebaseQuestionsModule.addQuestion(question, answers, correctAnswers);
    }

    function clearDialog() {
        'use strict';
        textareaQuestion.value = '';
        numAnswers = 2;
        updateDialogDisplay(numAnswers, labelNumAnswers, divAnchorAnswers, divAnchorCorrectAnswers);
    }

    // ============================================================================================
    // private helper functions (viewer)

    function addEntryToQuestionsTable(counter, entry) {
        'use strict';

        console.log('addEntryToQuestionsTable .................');

        // adding dynamically a 'material design lite' node to a table, for example
        //
        // <tr>
        //     <td>Frage 1</td>
        //     <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
        //         Tables are a ubiquitous feature of most user interfaces, regardless of a site's content or function. Their design and use
        //         is therefore an important factor in the overall user experience. See the data-table
        //         component's Material Design specifications page for details
        //     </td>
        //     <td>Mathe</td>
        // </tr>
        //     <tr>
        //         <td>Anwort 1</td>
        //         <td class="mdl-data-table__cell--non-numeric" style="word-wrap: break-word;  white-space: normal;">
        //             Nein
        //         </td>
        //         <td>
        //             <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //                 <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //             </label>
        //         </td>
        //     </tr>

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node

        var header = 'Frage ' + counter + ':';
        var textnode1 = document.createTextNode(header);          // create first text node
        var textnode2 = document.createTextNode(entry.question);  // create second text node
        var textnode3 = document.createTextNode('Mathe');         // create third text node

        td1.appendChild(textnode1);   // append text to <td>
        td2.appendChild(textnode2);   // append text to <td>
        td3.appendChild(textnode3);   // append text to <td>

        node.appendChild(td1);  // append <td> to <tr>
        node.appendChild(td2);  // append <td> to <tr>
        node.appendChild(td3);  // append <td> to <tr>
        tableQuestionsBody.appendChild(node);    // append <tr> to <tbody>

        // var label = document.createElement('label');     // create <label> node

        // label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');  // set attribute
        // label.setAttribute('for', 'row_' + rowCounterSubjects);  // set attribute
        // label.setAttribute('id', 'label_' + rowCounterSubjects);  // set attribute
        // var input = document.createElement('input');     // create <input> node
        // input.setAttribute('class', 'mdl-checkbox__input checkbox_select_subject');  // set attribute
        // input.setAttribute('type', 'checkbox');  // set attributes
        // input.setAttribute('id', 'row_' + rowCounterSubjects);  // set attribute
        // input.addEventListener('click', checkboxHandler);
        // rowCounterSubjects++;
        // label.appendChild(input);
        // td1.appendChild(label);

        // var td2 = document.createElement('td');     // create second <td> node
        // var td3 = document.createElement('td');     // create third <td> node
        // td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        // td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        // var textnode1 = document.createTextNode(entry.name);             // create second text node
        // var textnode2 = document.createTextNode(entry.description);      // create third text node
        // td2.appendChild(textnode1);                 // append text to <td>
        // td3.appendChild(textnode2);                 // append text to <td>
        // node.appendChild(td1);                      // append <td> to <tr>
        // node.appendChild(td2);                      // append <td> to <tr>
        // node.appendChild(td3);                      // append <td> to <tr>
        // tableSubjectsBody.appendChild(node);        // append <tr> to <tbody>

        // componentHandler.upgradeDom();
    };

    // ============================================================================================
    // public functions

    return {
        init: init,
    };
})();