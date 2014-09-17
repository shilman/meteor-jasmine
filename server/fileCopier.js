/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false,
 runServerTests: false,
 VelocityTestFiles: false
 */

if (process.env.NODE_ENV === 'development') {
  var _ = Npm.require('lodash')
  var rerunServerTests = _.throttle(Meteor.bindEnvironment(runServerTests, 'runServerTests'), 100)

  Meteor.startup(function () {
    var testFilesCursor = VelocityTestFiles.find({
      targetFramework: TEST_FRAMEWORK_NAME
    })

    var testFilesObserver = testFilesCursor.observe({
      added: rerunServerTests,
      changed: rerunServerTests,
      removed: rerunServerTests
    })

    var fileCopier = new Velocity.FileCopier({
      targetFramework: TEST_FRAMEWORK_NAME,
      shouldCopy: function (filepath) {
        var isClient = filepath.absolutePath.indexOf('server') === -1

        return isClient
      }
    })
    fileCopier.start()
  })
}
