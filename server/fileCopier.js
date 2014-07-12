/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false,
 runServerTests: false
 */

var TEST_RUN_WAIT_TIME = 100;
var rerunTimer = null;

function rerunTests() {
  runServerTests();
}

function startTestsRerunTimeout() {
  if (rerunTimer) {
    Meteor.clearTimeout(rerunTimer);
  }
  rerunTimer = Meteor.setTimeout(rerunTests, TEST_RUN_WAIT_TIME);
}

if (process.env.NODE_ENV === 'development') {
  Meteor.startup(function () {
    var fileCopier = new Velocity.FileCopier({
      targetFramework: TEST_FRAMEWORK_NAME,
      onFileAdded: startTestsRerunTimeout,
      onFileChanged: startTestsRerunTimeout,
      onFileRemoved: startTestsRerunTimeout
    });
    fileCopier.start();
  });
}
