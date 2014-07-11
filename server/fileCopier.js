/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false
 */

Meteor.startup(function () {
  var fileCopier = new Velocity.FileCopier({
    targetFramework: TEST_FRAMEWORK_NAME
  });
  fileCopier.start();
});
