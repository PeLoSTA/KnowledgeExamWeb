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
        'use strict';
        database = firebase.database();  // get a reference to the database service
        classesList = [];                // empty list of classes
    }

    // ============================================================================================
    // public interface

    function getClasses() {
        'use strict';
        return database.ref(refClasses).once('value')
            .then((snapshot) => {
                classesList = [];
                let localList = [];
                snapshot.forEach(function (childSnapshot) {
                    var snap = childSnapshot.val();

                    let classs = {
                        name: snap.name,
                        description: snap.description,
                        key: childSnapshot.key
                    };

                    console.log("[Fire] -> Class " + snap.name + ", Description = " + snap.description + ", Key = " + childSnapshot.key);
                    classesList.push(classs);
                    localList.push(classs);
                });
                return localList;
            }).catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] getClasses failed! ' + msg);
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
                console.log('[Fire] addClass failed! ' + msg);
                throw msg;
            });
    }

    function updateClass(classs) {
        'use strict';
        var refString = refClasses + '/' + classs.key;

        return database.ref(refString).update({ name: classs.name, description: classs.description })
            .then(() => {
                console.log('[Fire] updateClass done !!! ');
            })
            .catch((err) => {
                let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
                console.log('[Fire] updateClass failed! ' + msg);
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
            console.log('[Fire] deleteClass failed! ' + msg);
            return Promise.reject(msg);
        }

        return database.ref(refDeleteString).remove().then(() => {
            return keyOfClass;
        }).catch((err) => {
            let msg = "FirebaseClassesModule: ERROR " + err.code + ", Message: " + err.message;
            console.log('[Fire] deleteClass failed! ' + msg);
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

    function getNameOfClass(key) {
        'use strict';
        for (var k = 0; k < classesList.length; k++) {
            if (classesList[k].key === key) {
                return classesList[k].name;
            }
        }
        return '';
    }

    return {
        init: init,
        addClass: addClass,
        updateClass: updateClass,
        deleteClass: deleteClass,

        getClass: getClass,
        getClasses: getClasses,
        getNameOfClass: getNameOfClass
    }
})();