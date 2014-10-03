var logPrefix = '[jasmine] '

var addPrefix = function () {
  if (_.isString(arguments[0]) && arguments[0][0] !== '[') {
    arguments[0] = logPrefix + arguments[0]
  }
}

// Debug log helper
if (Meteor.isServer && process.env.VELOCITY_DEBUG) {
  debug = function () {
    addPrefix.apply(this, arguments)
    console.log.apply(console, arguments)
  }
} else {
  debug = function () {}
}

// Info log helper
logInfo = function () {
  addPrefix.apply(this, arguments)
  console.log.apply(console, arguments)
}

// Error log helper
logError = function () {
  addPrefix.apply(this, arguments)
  console.error.apply(console, arguments)
}
