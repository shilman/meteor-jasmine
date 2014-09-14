/* global
*/
var _ = Npm.require('lodash')
var ddpParentConnection = null

Meteor.startup(function(){
  var parentUrl = process.env.PARENT_URL

  if (parentUrl) {
    ddpParentConnection = DDP.connect(parentUrl)
  }
})



//  this.name = "jasmine-unit-client"
//  this.name = "jasmine-integration-server"
//  this.name = "jasmine-integration-client"


JasmineTestFramework = function (options) {
  if (!options || !options.name) {
    throw new Error("[JasmineTestFramework] Missing required field 'name'")
  }

  if (!options.regex) {
    throw new Error("[JasmineTestFramework] Missing required field 'regex'")
  }

  if (!options.jasmineRequire) {
    throw new Error("[JasmineTestFramework] Missing required field 'jasmineRequire'")
  }

  this.name = options.name
  this.regex = options.regex
  this.logPrefix = options.logPrefix || '[' + this.name + '] '
  this.jasmineRequire = options.jasmineRequire


  // setup each framework
  this._registerToVelocity()

  // load jasmine-velocity reporter
  // [unit] mock packages

}

_.extend(JasmineTestFramework.prototype, {

  ////////////////////////////////////////////////////////////////////// 
  // Public functions
  //
 
  start: function () {
    var testFilesCursor = VelocityTestFiles.find({
      targetFramework: this.name
    });

    var _runTests  = _.throttle(Meteor.bindEnvironment(this.runTests.bind(this),
                                  '[JasmineTestFramework.start.runTests]'), 100)

    this._observer = testFilesCursor.observe({
      added: _runTests,
      changed: _runTests,
      removed: _runTests
    });
  },

  runTests: function () {
    // create instance of jasmine
    this._createJasmineInstance()

    // specific to each framework
    this._executeTests()
  },

  ////////////////////////////////////////////////////////////////////// 
  // Protected functions
  //
 
  _registerToVelocity: function () {
    Velocity.registerTestingFramework(this.name, {regex: this.regex})
  },

  _createJasmineInstance: function () {
    var jasmine = this.jasmineRequire.core(this.jasmineRequire)

    this.jasmine = jasmine
    this.jasmineInterface = new JasmineInterface({jasmine: jasmine})
  }

})
