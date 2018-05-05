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
                    console.log("[Firebase] -> Class " + snap.name + ", Description = " + snap.description + ", Key = " + childSnapshot.key);
                    classesList.push(classs);
                    localList.push(classs);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Firebase] getClasses failed! ' + msg);
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
                console.log('[Firebase] addClass failed! ' + msg);
                throw msg;
            });
    }

    function deleteClass(name) {
        'use strict';

        // search class to delete
        var refDeleteString = '';
        var keyOfClass = '';
        for (var k = 0; k < classesList.length; k++) {

            if (classesList[k].name === name) {

                keyOfClass = classesList[k].key;
                refDeleteString = refClasses + '/' + keyOfClass;
                break;
            }
        }
        if (refDeleteString === '') {
            let msg = "FirebaseClassesModule: INTERNAL ERROR: class " + name + " not found!";
            console.log('[Firebase] deleteClass failed! ' + msg);
            return Promise.reject(msg);
        }

        return database.ref(refDeleteString).remove().then(() => {
            return keyOfClass;
        }).catch((err) => {
            let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
            console.log('[Firebase] deleteClass failed! ' + msg);
            throw msg;
        });
    }

    function getClass(index) {
        'use strict';
        if (index < 0 || index >= classesList.length) {
            return null;
        }

        return classesList[index];
    }

    return {
        init: init,
        addClass: addClass,
        deleteClass: deleteClass,

        getClassesPr: getClassesPr,
        getClass: getClass
    }
})();