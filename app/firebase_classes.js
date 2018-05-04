/*global FirebaseHelpers */
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

    function getClassesPr() {
        'use strict';
        return database.ref(refClasses).once('value')
            .then((snapshot) => {
                classesList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();
                    let classs = { name: snap.name, description: snap.description, key: childSnapshot.key };
                    FirebaseHelpers.firelog("-> Class " + snap.name + ", Description = " + snap.description + ", Key = " + childSnapshot.key);
                    classesList.push(classs);
                    localList.push(classs);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                FirebaseHelpers.firelog('getClasses failed! ' + msg);
                throw msg;
            });
    }

    function addClass(name, description) {
        'use strict';
        var key = '';

        return database.ref(refClasses).push()
            .then((newRef) => {
                key = newRef.key;
                return newRef.set({ name: name, description: description });
            })
            .then(() => {
                return key;
            })
            .catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                FirebaseHelpers.firelog('addClass failed! ' + msg);
                throw msg;
            });
    }

    return {
        init: init,
        addClass: addClass,
        getClassesPr: getClassesPr
    }
})();