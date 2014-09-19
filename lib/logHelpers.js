var logPrefix = '[jasmine] '

// Debug log helper
if (process.env.VELOCITY_DEBUG) {
  debug = function () {
    arguments[0] = logPrefix + arguments[0]
    console.log.apply(console, arguments)
  }
} else {
  debug = _.noop
}

// Info log helper
logInfo = function () {
  arguments[0] = logPrefix + arguments[0]
  console.log.apply(console, arguments)
}

// Error log helper
logError = function () {
  arguments[0] = logPrefix + arguments[0]
  console.error.apply(console, arguments)
}
