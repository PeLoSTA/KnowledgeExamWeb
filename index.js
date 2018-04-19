FirebaseSubjectsModule.init();
FirebaseQuestionsModule.init();
HtmlSubjectsModule.init();
HtmlQuestionsModule.init();

HtmlSubjectsModule.updateTableOfSubjects();

// TODO: Hmmm, can be removed ....
window.onload = function(){
    
    'use strict';
    console.log('================> onload');
};