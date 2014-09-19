//////////////////////////////////////////////////////////////////////
// MISC FUNCTIONS
//
debug = _.noop

// Debug log helper
if (process.env.VELOCITY_DEBUG) {
  debug = function () {
    arguments[0] = '[jasmine] ' + arguments[0]
    console.log.apply(console, arguments)
  }
}
