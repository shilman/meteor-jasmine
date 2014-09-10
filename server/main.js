/* global
   TEST_FRAMEWORK_NAME: true,
   debug: true
*/
var _ = Npm.require('lodash')

TEST_FRAMEWORK_NAME = 'jasmine'
TEST_FRAMEWORK_LOG_PREFIX = '[' + TEST_FRAMEWORK_NAME + '] '

if (Velocity && Velocity.registerTestingFramework) {
  Velocity.registerTestingFramework(TEST_FRAMEWORK_NAME, {
    regex: 'jasmine/.+\\.(js|coffee|litcoffee|coffee\\.md)$'
  })
}

// Debug log helper
if (process.env.VELOCITY_DEBUG) {
  debug = function () {
    arguments[0] = TEST_FRAMEWORK_LOG_PREFIX + arguments[0]
    console.log.apply(console, arguments)
  }
} else {
  debug = _.noop
}

// Error log helper
logError = function () {
  arguments[0] = TEST_FRAMEWORK_LOG_PREFIX + arguments[0]
  console.error.apply(console, arguments)
}
