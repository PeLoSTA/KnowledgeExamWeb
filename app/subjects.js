var SubjectsModule = (function () {

    // retrieve HTML elements according to 'subjects' tab
    var btnList = document.getElementById('btnList');
    var btnCreate = document.getElementById('btnCreate');
    var btnDelete = document.getElementById('btnModify');
    var btnDelete = document.getElementById('btnDelete');

    var htmlTableSubjectsBody = document.getElementById('tableSubjectsBody');

    function init() {
        bindUIActions();
    };

    function bindUIActions() {
        'use strict';
        btnList.addEventListener('click', function () {

            updateTableOfSubjectsBegin();
            FirebaseModule.readListOfSubjects(callback);
        });
    };

    function callback(subject) {
        'use strict';
        updateTableOfSubjectsNext(subject);
    };

    function updateTableOfSubjectsBegin() {
        'use strict';
        console.log("updateTableOfSubjectsBegin");
        htmlTableSubjectsBody.innerHTML = '';
        componentHandler.upgradeDom();
    }

    function updateTableOfSubjectsNext(entry) {
        'use strict';
        
        // adding dynamically a 'material design lite' node to a table, for example
        //
        //  <tr>
        //      <td class="mdl-data-table__cell--non-numeric">C++</td>
        //      <td class="mdl-data-table__cell--non-numeric">Beyond C</td>
        //  </tr>

        var node = document.createElement('tr');    // create a <tr> node
        var td1 = document.createElement('td');     // create first <td> node
        var td2 = document.createElement('td');     // create second <td> node
        td2.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set an attribute
        td1.setAttribute('class', 'mdl-data-table__cell--non-numeric');  // set an attribute
        var textnode1 = document.createTextNode(entry.name);             // create first text node
        var textnode2 = document.createTextNode(entry.description);      // create second text node
        node.appendChild(td1);                      // append <td> to <tr>
        node.appendChild(td2);                      // append <td> to <tr>
        td1.appendChild(textnode1);                 // append text to <td>
        td2.appendChild(textnode2);                 // append text to <td>
        htmlTableSubjectsBody.appendChild(node);    // append <tr> to <tbody>

        componentHandler.upgradeDom();
    }

    return {
        init: init,
        updateTableOfSubjectsBegin: updateTableOfSubjectsBegin,
        updateTableOfSubjectsNext: updateTableOfSubjectsNext
    };

})();