var FirebaseHelpers = (function () {

    var trace = true;

    function init() {

        trace = true;
    }

    // ============================================================================================
    // public interface

    function firelog(msg) {

        if (trace) {
            console.log("Firebase: " + msg);
        }
    }

    function htmllog(msg) {

        if (trace) {
            console.log("Html: " + msg);
        }
    }


    return {
        init: init,
        firelog: firelog,
        htmllog: htmllog
    };
})();




