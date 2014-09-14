
var frameworks = {
  //integrationServer: new IntegrationServerTestFramework(),
  //integrationClient: new IntegrationClientTestFramework(),
  //unitClient: new unitClientTestFramework(),
  serverUnit: new ServerUnitTestFramework()
}

//frameworks.integrationServer.runTests()
//frameworks.integrationClient.runTests()
//frameworks.unitClient.runTests()
frameworks.serverUnit.start()
