/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false
 */

if (process.env.NODE_ENV === 'development') {
  Meteor.startup(function () {
    var rerunTests = function () {
      runServerTests();
    };

    var fileCopier = new Velocity.FileCopier({
      targetFramework: TEST_FRAMEWORK_NAME,
      onFileAdded: rerunTests,
      onFileChanged: rerunTests,
      onFileRemoved: rerunTests
    });
  });
}
