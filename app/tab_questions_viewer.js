var HtmlTabQuestionsViewerModule = (function () {

    // retrieve HTML elements according to 'questions viewer' tab
    var tabQuestionsSurvey = document.getElementById('#questions-panel-survey');
    var tableQuestionsBody = document.getElementById('tableQuestionsBody');
    var menuSubjectsSurvey = document.getElementById('menuSubjectsSurvey');
    var textfieldCurrentSubjectSurvey = document.getElementById('textfieldCurrentSubjectSurvey');

    // miscellaneous data
    var isActive;         // needed to prevent double clicks
    var currentSubject;   // needed to assign question input to this subject (survey)
    var rowCounter;       // needed to create unique id for each table row

    // ============================================================================================
    // initialization

    function init() {
        // questions
        currentSubject = null;

        // connect ui elements with event handlers
        bindUIActions();
    };


    function bindUIActions() {
        'use strict';
        tabQuestionsSurvey.addEventListener('click', () => {
            'use strict';
            onLoadListOfSubjectsSurvey();
            onLoadQuestionsSurvey();
        });
    };

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
        rowCounter = 1;
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
        //         Tables are a ubiquitous feature of most user interfaces, regardless of a ...
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

        // add single row for question itself

        var keyOfSubject = entry['subject-key'];
        var nameOfSubject = FirebaseSubjectsModule.getNameOfSubject(keyOfSubject);
        var node = createQuestion(counter, entry.question, nameOfSubject);
        tableQuestionsBody.appendChild(node);

        // add rows for answers
        var numAnswers = entry['num-answers'];
        var numCorrectAnswers = entry['num-correct-answers'];
        var useRadioButton = (numCorrectAnswers === 1);

        for (var row = 0; row < numAnswers; row++) {

            var nodeAnswer = createAnswer(
                row,
                entry.answers[row],
                useRadioButton,
                entry['correct-answers'][row]
            );

            tableQuestionsBody.appendChild(nodeAnswer);
        }
        componentHandler.upgradeDom();
    };

    // ============================================================================================
    // private helper functions (ui - questions table - viewer)

    function createQuestion(counter, text, name) {

        var node = document.createElement('tr');    // create <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var td2 = document.createElement('td');     // create second <td> node
        var td3 = document.createElement('td');     // create third <td> node

        td1.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td1.setAttribute('style', 'text-align:left;');  // set attribute

        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td2.setAttribute('style', 'text-align:left;');  // set attribute

        td3.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td3.setAttribute('style', 'text-align:right;');  // set attribute

        var header = 'Frage ' + counter + ':';
        var textnode1 = document.createTextNode(header); // create first text node
        var textnode2 = document.createTextNode(text);   // create second text node
        var textnode3 = document.createTextNode(name);   // create third text node

        td1.appendChild(textnode1);   // append text to <td>
        td2.appendChild(textnode2);   // append text to <td>
        td3.appendChild(textnode3);   // append text to <td>

        node.appendChild(td1);  // append <td> to <tr>
        node.appendChild(td2);  // append <td> to <tr>
        node.appendChild(td3);  // append <td> to <tr>

        return node;
    }

    function createAnswer(number, question_text, useRadioButton, isCorrect) {

        var nodeAnswer = document.createElement('tr');    // create <tr> node

        var td1Answer = document.createElement('td');     // create first <td> node
        var td2Answer = document.createElement('td');     // create second <td> node
        var td3Answer = document.createElement('td');     // create third <td> node

        td2Answer.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set attribute
        td2Answer.setAttribute('style', 'word-wrap: break-word;  white-space: normal;');  // set attribute

        var headerAnswer = 'Antwort ' + (number + 1) + ':';
        var textNodeAnswer1 = document.createTextNode(headerAnswer);  // create first text node
        var textnodeAnswer2 = document.createTextNode(question_text); // create second text node

        td1Answer.appendChild(textNodeAnswer1);   // append text to <td>
        td2Answer.appendChild(textnodeAnswer2);   // append text to <td>

        // create third node
        var label = (useRadioButton) ?
            createRadioButton(rowCounter, isCorrect) :
            createCheckBox(rowCounter, isCorrect);

        td3Answer.appendChild(label);       // append <label> to <td>
        rowCounter++;

        nodeAnswer.appendChild(td1Answer);  // append <td> to <tr>
        nodeAnswer.appendChild(td2Answer);  // append <td> to <tr>
        nodeAnswer.appendChild(td3Answer);  // append <td> to <tr>

        return nodeAnswer;
    }

    function createRadioButton(id, checked) {

        // <td>
        //     <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-data-table__select" for="row_1">
        //         <input type="checkbox" id="row_1" class="mdl-radio__button" />
        //     </label>
        // </td>

        'use strict';
        var label = document.createElement('label');  // create <label> node
        label.setAttribute('class', 'mdl-radio mdl-js-radio mdl-js-ripple-effect mdl-data-table__select');
        label.setAttribute('for', 'row__' + id);  // set attribute

        var input = document.createElement('input');       // create <input> node
        input.setAttribute('class', 'mdl-radio__button');  // set attribute
        input.setAttribute('type', 'radio');     // set attribute
        input.setAttribute('id', 'row__' + id);  // set attribute

        label.appendChild(input);  // append <input> to <label>

        // https://stackoverflow.com/questions/31413042/toggle-material-design-lite-checkbox
        var mdlRadio = new MaterialRadio(label);
        (checked) ? mdlRadio.check() : mdlRadio.uncheck();
        // mdlRadio.check();
        mdlRadio.disable();

        return label;
    }

    function createCheckBox(id, checked) {

        // <td>
        //     <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[1]">
        //         <input type="checkbox" id="row[1]" class="mdl-checkbox__input" />
        //     </label>
        // </td>

        'use strict';
        var label = document.createElement('label');  // create <label> node
        label.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select');
        label.setAttribute('for', 'row__' + id);   // set attribute

        var input = document.createElement('input');         // create <input> node
        input.setAttribute('class', 'mdl-checkbox__input');  // set attribute
        input.setAttribute('type', 'checkbox');  // set attribute
        input.setAttribute('id', 'row__' + id);  // set attribute

        label.appendChild(input);  // append <input> to <label>

        // https://stackoverflow.com/questions/31413042/toggle-material-design-lite-checkbox
        var mdlCheckbox = new MaterialCheckbox(label);
        (checked) ? mdlCheckbox.check() : mdlCheckbox.uncheck();
        // mdlCheckbox.check();
        mdlCheckbox.disable();

        return label;
    }

    // ============================================================================================
    // private helper functions (ui - subjects menu - survey tab)  

    // TODO: RENAME Survey to Viewer !!!!

    function onLoadListOfSubjectsSurvey() {
        'use strict';
        addMenuEntrySurvey({ name: 'Alle', description: '', key: '' });
        FirebaseSubjectsModule.readListOfSubjects(addMenuEntrySurvey, doneMenuSurvey);
    }

    function addMenuEntrySurvey(subject) {
        'use strict';

        // <li>
        //     <p class="mdl-menu__item">Subject</p>
        // </li>

        var listitem = document.createElement('li');   // create <li> node
        var para = document.createElement('p');        // create <p> node
        para.setAttribute('class', 'mdl-menu__item');  // set attribute
        var textnode = document.createTextNode(subject.name);  // create text node
        para.appendChild(textnode);                    // append text to <p>
        listitem.appendChild(para);                    // append <p> to <li>
        menuSubjectsSurvey.appendChild(listitem);      // append <li> to <ul>

        listitem.addEventListener('click', () => {
            'use strict';
            // retrieving selected subject from closure
            currentSubject = subject;
            textfieldCurrentSubjectSurvey.value = currentSubject.name;

            FirebaseQuestionsModule.readListOfQuestionsFromSubject(currentSubject.key, addMenuEntrySurvey, doneMenuSurvey);
        });
    }

    function doneMenuSurvey() {
        'use strict';
        componentHandler.upgradeDom();
    }

    // ============================================================================================
    // public functions

    return {
        init: init
    };

})();
