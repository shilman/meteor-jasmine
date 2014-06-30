/* global
   TEST_FRAMEWORK_NAME: true,
   debug: true
*/
TEST_FRAMEWORK_NAME = 'jasmine';

// Debug log helper
if (process.env.VELOCITY_DEBUG) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments);
    args[0] = TEST_FRAMEWORK_NAME + ': ' + args[0];
    console.log.apply(console, args);
  };
} else {
  debug = function noop() {};
}
