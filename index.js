/*global FirebaseClassesModule */
/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */
/*global FirebaseStudentsModule */
/*global FirebaseExamsModule */

/*global HtmlTabClassesModule */
/*global HtmlTabCoursesModule */
/*global HtmlTabQuestionsAdminModule */
/*global HtmlTabQuestionsViewerModule */
/*global HtmlTabStudentsModule */
/*global HtmlTabExamsModule */

FirebaseClassesModule.init();
FirebaseCoursesModule.init();
FirebaseQuestionsModule.init();
FirebaseStudentsModule.init();
FirebaseExamsModule.init();

HtmlTabClassesModule.init();
HtmlTabCoursesModule.init();
HtmlTabStudentsModule.init();
HtmlTabQuestionsAdminModule.init();
HtmlTabQuestionsViewerModule.init();
HtmlTabExamsModule.init();

HtmlTabClassesModule.updateTableOfClasses(true, true);
HtmlTabCoursesModule.updateTableOfCourses(true, true);
