/* global
 TEST_FRAMEWORK_NAME: false,
 Velocity: false,
 runServerTests: false
 */
var _ = Npm.require('lodash')

/*
 * NOTE: Should be moved into the client-side test framework classes
 *
 *
if (process.env.NODE_ENV === 'development') {
  Meteor.startup(function () {
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
*/
