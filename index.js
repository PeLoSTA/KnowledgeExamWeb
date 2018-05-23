/*global FirebaseClassesModule */
/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */
/*global FirebaseStudentsModule */

/*global HtmlTabClassesModule */
/*global HtmlTabCoursesModule */
/*global HtmlTabQuestionsAdminModule */
/*global HtmlTabQuestionsViewerModule */
/*global HtmlTabStudentsModule */

FirebaseClassesModule.init();
FirebaseCoursesModule.init();
FirebaseQuestionsModule.init();
FirebaseStudentsModule.init();

HtmlTabClassesModule.init();
HtmlTabCoursesModule.init();
HtmlTabStudentsModule.init();
HtmlTabQuestionsAdminModule.init();
HtmlTabQuestionsViewerModule.init();

HtmlTabClassesModule.updateTableOfClasses(true, true);
HtmlTabCoursesModule.updateTableOfCourses(true, true);
