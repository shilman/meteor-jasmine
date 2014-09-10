/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false,
 runServerTests: false
 */
var _ = Npm.require('lodash')

var rerunTests = _.throttle(Meteor.bindEnvironment(runServerTests, 'runServerTests'), 100)

if (process.env.NODE_ENV === 'development') {
  Meteor.startup(function () {
    var fileCopier = new Velocity.FileCopier({
      targetFramework: TEST_FRAMEWORK_NAME,
      onFileAdded: rerunTests,
      onFileChanged: rerunTests,
      onFileRemoved: rerunTests,
      shouldCopy: function (filepath) {
        var isClient = filepath.absolutePath.indexOf('server') === -1

        return isClient
      }
    })
    fileCopier.start()
  })
}
