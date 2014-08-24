/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false,
 runServerTests: false
 */
var _ = Npm.require('lodash')

var rerunTests = _.throttle(runServerTests, 100)

if (process.env.NODE_ENV === 'development') {
  Meteor.startup(function () {
    var fileCopier = new Velocity.FileCopier({
      targetFramework: TEST_FRAMEWORK_NAME,
      onFileAdded: rerunTests,
      onFileChanged: rerunTests,
      onFileRemoved: rerunTests
    })
    fileCopier.start()
  })
}
