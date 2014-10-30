
frameworks = {
  //serverIntegration: new ServerIntegrationTestFramework(),
  clientIntegration: new ClientIntegrationTestFramework(),
  //clientUnit: new ClientUnitTestFramework(),
  serverUnit: new ServerUnitTestFramework()
}

if (!process.env.IS_MIRROR) {
  frameworks.clientIntegration.registerWithVelocity()
  frameworks.clientIntegration.startFileCopier()

  frameworks.serverUnit.registerWithVelocity()

  Meteor.startup(function () {
    //frameworks.serverIntegration.runTests()
    //frameworks.clientUnit.runTests()
    frameworks.serverUnit.start()
  })
}
