var HtmlTabMiscModule = (function () {

    // ============================================================================================
    // public interface

    function fillClassesDropDownList(selectElem, entries) {
        'use strict';

        /*
         *   strucure of HTML drop-down list
         */

        // <select class="mdl-selectfield__select" id="selectStudentsSubjects">
        //     <option value="option0"></option>
        //     <option value="option1">option 1</option>
        //     <option value="option2">option 2</option>
        //     <option value="option3">option 3</option>
        //     <option value="option4">option 4</option>
        //     <option value="option5">option 5</option>
        // </select>

        // clear contents of list
        selectElem.innerHTML = '';

        // add empty node
        addEntryToSelectList(selectElem, 0, null);

        // add each subject of the list
        for (let i = 0; i < entries.length; i++) {
            addEntryToSelectList(selectElem, i + 1, entries[i]);
        }
    }

    function addEntryToSelectList(selectElem, index, entry) {
        'use strict';
        let optionNode = document.createElement('option');    // create <option> node
        optionNode.setAttribute('value', 'option_' + index);  // set attribute

        let text = (entry === null) ? '' : entry.name;
        let textNode = document.createTextNode(text);         // create text node

        optionNode.appendChild(textNode);                     // append text to <option> node
        selectElem.appendChild(optionNode);                   // append <option> node to <select> element
    }

    return {
        fillClassesDropDownList: fillClassesDropDownList
    }

})();