/* global
 runServerTests: true,
 VelocityTestReporter: false,
 runFileInContext: false
 */

var fs = Npm.require('fs')
var readFile = Meteor._wrapAsync(fs.readFile)
var util = Npm.require('util')
var path = Npm.require('path')
var vm = Npm.require('vm')
var _ = Npm.require('lodash')
Npm.require('meteor-stubs')

// boot code for jasmine
var jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js')
var jasmine = jasmineRequire.core(jasmineRequire)

var consoleFns = Npm.require('jasmine-core/lib/console/console.js')
_.extend(jasmineRequire, consoleFns)
jasmineRequire.console(jasmineRequire, jasmine)

var isRunning = false

var jasmineInterface = {
  describe: function(description, specDefinitions) {
    return jasmine.getEnv().describe(description, specDefinitions)
  },

  xdescribe: function(description, specDefinitions) {
    return jasmine.getEnv().xdescribe(description, specDefinitions)
  },

  it: function(desc, func) {
    return jasmine.getEnv().it(desc, func)
  },

  xit: function(desc, func) {
    return jasmine.getEnv().xit(desc, func)
  },

  beforeEach: function(beforeEachFunction) {
    return jasmine.getEnv().beforeEach(beforeEachFunction)
  },

  afterEach: function(afterEachFunction) {
    return jasmine.getEnv().afterEach(afterEachFunction)
  },

  expect: function(actual) {
    return jasmine.getEnv().expect(actual)
  },

  spyOn: function(obj, methodName) {
    return jasmine.getEnv().spyOn(obj, methodName)
  },

  jsApiReporter: new jasmine.JsApiReporter({
    timer: new jasmine.Timer()
  })
}

_.extend(jasmine, {
  addCustomEqualityTester: function(tester) {
    jasmine.getEnv().addCustomEqualityTester(tester)
  },

  addMatchers: function(matchers) {
    return jasmine.getEnv().addMatchers(matchers)
  },

  clock: function() {
    return jasmine.getEnv().clock
  }
})

runServerTests = function () {
  if (isRunning) {
    return
  }

  isRunning = true

  // Force to create a new Env
  jasmine.currentEnv_ = null

  // options from command line
  var isVerbose = true
  var showColors = true

  var unitSpecs = getSpecFiles(path.join(Velocity.getTestsPath(), 'jasmine', 'server', 'unit'))
  var integrationSpecs = getSpecFiles(path.join(Velocity.getTestsPath(), 'jasmine', 'server', 'integration'))

  var onTestsFinished = function () {
    isRunning = false
  }
  var runIntegrationTests = Meteor.bindEnvironment(function () {
    executeSpecsInContextMode(integrationSpecs, onTestsFinished, isVerbose, showColors)
  }, 'executeSpecsInContextMode')
  // TODO: Run integration tests too
  runIntegrationTests()
  //executeSpecsUnitMode(unitSpecs, runIntegrationTests, isVerbose, showColors)
}

function executeSpecsInContextMode(specs, done, isVerbose, showColors) {
  var contextGlobal = global
  _.extend(contextGlobal, jasmineInterface)
  contextGlobal.mocker = contextGlobal.ComponentMocker = Npm.require('component-mocker')

  var context = vm.createContext(contextGlobal)

  var jasminePackagePath = path.join(process.env.PWD, 'packages', 'jasmine')

  // Load context tests
  var contextSpecPath = path.join(jasminePackagePath, 'common', 'contextSpec.js')
  runFileInContext(contextSpecPath, context)

  // Load mocker
  var mockerPath = path.join(jasminePackagePath, 'common', 'mocker.js')
  runFileInContext(mockerPath, context)

  // Load specs
  for (var i = 0; i < specs.length; i++) {
    runFileInContext(specs[i], context)
  }

  var env = jasmine.getEnv()
  var consoleReporter = new jasmine.ConsoleReporter({
    print: util.print,
    onComplete: done,
    showColors: showColors,
    timer: new jasmine.Timer()
  })

  var velocityReporter = new VelocityTestReporter({
    mode: "Server Integration",
    env: env,
    timer: new jasmine.Timer()
  })

  env.addReporter(consoleReporter)
  env.addReporter(velocityReporter)
  env.execute()
}

// Jasmine "runner"
function executeSpecsUnitMode(specs, done, isVerbose, showColors) {
  var globalContext = {
    process: process,
    console: console,
    Buffer: Buffer,
    Npm: Npm,
    jasmine: jasmine,
    runFileInThisContext: runFileInThisContext,
    htmlScanner: htmlScanner,
    MeteorStubs: MeteorStubs,
    ComponentMocker: Npm.require('component-mocker')
  }
  globalContext.global = globalContext
  _.extend(globalContext, jasmineInterface)
  MeteorStubs.install(globalContext)
  globalContext.Meteor.isServer = true
  globalContext.Meteor.isClient = false

  var context = vm.createContext(globalContext)

  var packagePath = path.join(process.env.PWD, 'packages', 'jasmine')

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
  specs.push(path.join(packagePath, 'server', 'contextSpec.js'))

  // Load specs
  for (var i = 0; i < specs.length; i++) {
    runFileInContext(specs[i], context)
  }

  var env = jasmine.getEnv()
  var consoleReporter = new jasmine.ConsoleReporter({
    print: util.print,
    onComplete: done,
    showColors: showColors,
    timer: new jasmine.Timer()
  })

  var velocityReporter = new VelocityTestReporter({
    mode: "Server Unit",
    env: env,
    timer: new jasmine.Timer()
  })

  env.addReporter(consoleReporter)
  env.addReporter(velocityReporter)
  env.execute()
}

function getFiles(dir, matcher) {
  var allFiles = []

  if (fs.statSync(dir).isFile() && dir.match(matcher)) {
    allFiles.push(dir)
  } else {
    var files = fs.readdirSync(dir)
    for (var i = 0, len = files.length; i < len; ++i) {
      var filename = dir + '/' + files[i]
      if (fs.statSync(filename).isFile() && filename.match(matcher)) {
        allFiles.push(filename)
      } else if (fs.statSync(filename).isDirectory()) {
        var subfiles = getFiles(filename)
        subfiles.forEach(function(result) {
          allFiles.push(result)
        })
      }
    }
  }
  return allFiles
}

function getSpecFiles(dir) {
  return getFiles(dir, new RegExp('\\.js$'))
}
