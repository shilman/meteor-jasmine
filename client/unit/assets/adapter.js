// We pre hook the original Karma start method to do our initialisation
var karmaStart = window.__karma__.start

var createStartFn = function(karma) {
  return function(config) {
    var rootUrl = karma.config.args[0]
    window.ddpParentConnection = DDP.connect(rootUrl)

    // Wait with running the tests until the DDP connection is established
    Tracker.autorun(function (computation) {
      if (window.ddpParentConnection.status().connected) {
        computation.stop()

        // Add the Velocity Reporter
        var jasmineEnv = window.jasmine.getEnv()
        var velocityReporter = new VelocityTestReporter({
          mode: 'Client Unit',
          framework: 'jasmine-client-unit',
          env: jasmineEnv,
          timer: new window.jasmine.Timer()
        })
        jasmineEnv.addReporter(velocityReporter)

        // Start the Karma test run
        karmaStart.call(this, config)
      }
    })
  }
}

window.__karma__.start = createStartFn(window.__karma__)


// Give DDP some extra time to send all results before Karma shuts down
var karmaComplete = window.__karma__.complete
window.__karma__.complete = function (result) {
  setTimeout(function () {
    karmaComplete.call(window.__karma__, result)
  }, 1000)
}
