/* global
   Velocity: false
*/

var _ = Npm.require('lodash'),
    path = Npm.require('path'),
    vm = Npm.require('vm'),
    ComponentMocker = Npm.require('component-mocker'),
    jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js')

// MeteorStubs
Npm.require('meteor-stubs')

ServerUnitTestFramework = function (options) {
  options = options || {}

  _.defaults(options, {
    name: 'jasmine-server-unit',
    regex: 'jasmine/server/unit/.+\\.(js|coffee|litcoffee|coffee\\.md)$',
    //regex: 'jasmine/.+\\.(js|coffee|litcoffee|coffee\\.md)$',
    jasmineRequire: jasmineRequire
  })

  JasmineTestFramework.call(this, options)
}

ServerUnitTestFramework.prototype = _.create(JasmineTestFramework.prototype)

_.extend(ServerUnitTestFramework.prototype, {

  _executeTests: executeSpecsUnitMode,

  _reportResults: function () {
    Meteor.call('completed', {framework: this.name})
  }
})


// Jasmine "runner"
function executeSpecsUnitMode() {
  var testFilePath = path.join(Velocity.getTestsPath(), 'jasmine', 'server', 'unit')

  var globalContext = {
    process: process,
    console: console,
    Buffer: Buffer,
    Npm: Npm,
    MeteorStubs: MeteorStubs,
    ComponentMocker: ComponentMocker
  }

  globalContext.global = globalContext
  _.extend(globalContext, this.jasmineInterface)

  // Need to install Meteor here so the app code files don't throw an error 
  // when loaded
  MeteorStubs.install(globalContext)

  globalContext.Meteor.isServer = true
  globalContext.Meteor.isClient = false

  var context = vm.createContext(globalContext)

  // Load mock helper
  runCodeInContext(Assets.getText('lib/mock.js'), context, this.logPrefix)

  // load stubs
  try {
    stubLoader.loadUserStubs(context)
  }
  catch (ex) {
    console.log('Error loading stubs', ex.message, ex.stack)
  }

  // load Meteor app source files prior to running tests
  try {
    fileLoader.loadFiles(context, {ignoreDirs: 'client'})
  }
  catch (ex) {
    console.log('Error loading app files', ex.message, ex.stack)
  }

  // load MeteorStubs before and after each test
  runCodeInContext(Assets.getText('server/lib/contextSpec.js'), context, this.logPrefix)

  // Load specs
  var specs = getSpecFiles(testFilePath)
  for (var i = 0; i < specs.length; i++) {
    runFileInContext(specs[i], context, this.logPrefix)
  }


  var env = this.jasmine.getEnv()

  /*
  var consoleReporter = new jasmine.ConsoleReporter({
    print: util.print,
    showColors: true,
    timer: new this.jasmine.Timer()
  })
  */

  var velocityReporter = new VelocityTestReporter({
    mode: "Server Unit",
    framework: this.name,
    env: env,
    onComplete: this._reportResults.bind(this),
    timer: new this.jasmine.Timer()
  })

  //env.addReporter(consoleReporter)
  env.addReporter(velocityReporter)
  env.execute()
}
