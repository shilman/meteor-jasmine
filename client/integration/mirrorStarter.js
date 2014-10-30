var requestMirror = _.once(function () {
  Meteor.call(
    'velocity/mirrors/request',
    {
      framework: frameworks.clientIntegration.name,
      rootUrlPath: '/?jasmine=true'
    },
    function (error) {
      if (error) {
        logError(error)
      }
    }
  )
})

Meteor.startup(function () {
  var clientIntegrationTestsCursor = VelocityTestFiles.find(
    {targetFramework: frameworks.clientIntegration.name}
  )

  if (clientIntegrationTestsCursor.count() > 0) {
    requestMirror()
  } else {
    var clientIntegrationTestsObserver = clientIntegrationTestsCursor.observe({
      added: function () {
        clientIntegrationTestsObserver.stop()
        requestMirror()
      }
    })
  }
})
