/*global firebase */

var FirebaseClassesModule = (function () {

    // firebase
    const refClasses = '/classes';
    var database;

    // (last read) list of classes
    var classesList;

    // ============================================================================================
    // public functions

    function init() {

        database = firebase.database();  // get a reference to the database service
        classesList = [];                // empty list of classes
    }

    // ============================================================================================
    // public interface

    function readListOfClassesPr() {
        'use strict';
        return database.ref(refClasses).once('value')
            .then((snapshot) => {
                classesList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    console.log("Got class " + snap.name + ", Description = " + snap.description);
                    let classs = { name: snap.name, description: snap.description, key: childSnapshot.key };
                    classesList.push(classs);
                    localList.push(classs);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('Reading list of classes failed! [' + msg + ']');
                throw err;
            });
    }

    function addClass(name, description) {
        'use strict';
        var key = '';

        return database.ref(refClasses).push()
            .then((newRef) => {
                console.log('111');
                key = newRef.key;
                return newRef.set({ name: name, description: description });
            })
            .then(() => {
                console.log('222');
                return key;
            })
            .catch(function (err) {
                console.log('333');

                var msg = "Error: " + err.code + ", Message: " + err.message;

                console.log('err', msg);
                key = 'weiß nicht ....';
                throw msg;
            });
    }

    return {
        init: init,
        addClass: addClass
    }
})();