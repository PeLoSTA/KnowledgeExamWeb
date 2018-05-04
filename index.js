/*global FirebaseHelpers */
/*global FirebaseClassesModule */
/*global FirebaseCoursesModule */
/*global FirebaseQuestionsModule */
/*global FirebaseStudentsModule */

/*global HtmlTabClassesModule */
/*global HtmlTabCoursesModule */
/*global HtmlTabQuestionsAdminModule */
/*global HtmlTabQuestionsViewerModule */
/*global HtmlTabStudentsModule */

FirebaseHelpers.init();
FirebaseClassesModule.init();
FirebaseCoursesModule.init();
FirebaseQuestionsModule.init();
FirebaseStudentsModule.init();

HtmlTabClassesModule.init();
HtmlTabCoursesModule.init();
HtmlTabQuestionsAdminModule.init();
HtmlTabQuestionsViewerModule.init();
HtmlTabStudentsModule.init();

// HtmlTabCoursesModule.updateTableOfCoursesCb();
HtmlTabCoursesModule.updateTableOfCoursesPr();
