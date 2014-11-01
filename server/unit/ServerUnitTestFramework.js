/* global
   Velocity: false
*/

var path = Npm.require('path'),
    util = Npm.require('util'),
    Contextify = Npm.require('contextify'),
    ComponentMocker = Npm.require('component-mocker'),
    jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js')

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

ServerUnitTestFramework.prototype = Object.create(JasmineTestFramework.prototype)

_.extend(ServerUnitTestFramework.prototype, {

  start: function () {
    var testFilesCursor = VelocityTestFiles.find({
      targetFramework: this.name,
      relativePath: {
        $nin: [
          'tests/jasmine/server/unit/packageMocksSpec.js',
          'tests/jasmine/server/unit/package-stubs.js'
        ]
      }
    });

    var _runTests  = _.throttle(Meteor.bindEnvironment(this.runTests.bind(this),
      '[JasmineTestFramework.start.runTests]'), 100)

    this._observer = testFilesCursor.observe({
      added: _runTests,
      changed: _runTests,
      removed: _runTests
    });
  },

  runTests: function executeSpecsUnitMode() {
    var jasmine = this.jasmineRequire.core(this.jasmineRequire)
    var jasmineInterface = new JasmineInterface({jasmine: jasmine})

    var testFilePath = path.join(Velocity.getTestsPath(), 'jasmine', 'server', 'unit')

    var context = {
      process: process,
      console: console,
      Buffer: Buffer,
      Npm: Npm,
      MeteorStubs: MeteorStubs,
      ComponentMocker: ComponentMocker,
      // Private state data that only we use
      __jasmine: {
        Meteor: {
          settings: Meteor.settings
        }
      }
    }

    // Add all available packages that should be included
    packagesToIncludeInUnitTests.forEach(function (packageName) {
      var packageGlobals = Package[packageName]
      if (packageGlobals) {
        _.forEach(packageGlobals, function (packageGlobal, packageGlobalName) {
          if (!context[packageGlobalName]) {
            context[packageGlobalName] = packageGlobal
          }
        })
      }
    })

    _.extend(context, jasmineInterface)

    // Need to install Meteor here so the app code files don't throw an error
    // when loaded
    MeteorStubs.install(context)

    context.Meteor.isServer = true
    context.Meteor.isClient = false
    context.Meteor.settings = Meteor.settings
    context.Meteor.npmRequire = Meteor.npmRequire

    Contextify(context)
    context.global = context.getGlobal()

    // Load mock helper
    runCodeInContext(
      Assets.getText('lib/mock.js'),
      context
    )

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
    runCodeInContext(
      Assets.getText('server/lib/contextSpec.js'),
      context
    )

    // Load specs
    var specs = getSpecFiles(testFilePath)
    for (var i = 0; i < specs.length; i++) {
      fileLoader.loadFile(specs[i], context)
    }

    var consoleReporter = getJasmineConsoleReporter("tests/jasmine/server/unit/", false);
    var env = jasmine.getEnv()

    var velocityReporter = new VelocityTestReporter({
      mode: "Server Unit",
      framework: this.name,
      env: env,
      onComplete: this._onComplete.bind(this, context),
      timer: new jasmine.Timer()
    })

    env.addReporter(consoleReporter)
    env.addReporter(velocityReporter)
    env.execute()
  },

  _onComplete: function (context) {
    this._reportResults()
    context.dispose()
  },

  _reportResults: function () {
    Meteor.call('velocity/reports/completed', {framework: this.name})
  }
})
