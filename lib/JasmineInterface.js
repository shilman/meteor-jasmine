/**
 * Object that will be directly put into the global context of the running 
 * tests.
 *
 * ex. 
 *     describe(...)   // rather than 'jasmine.describe'
 *     jasmine.clock   // rather than just 'clock'
 *
 * @class JasmineInterface
 * @constructor
 */
JasmineInterface = function (options) {
  var self = this,
      env

  if (!options || !options.jasmine) {
    throw new Error("[JasmineInterface] Missing required field 'jasmine'")
  }

  self.jasmine = options.jasmine
  env = self.jasmine.getEnv()

  // extend the global jasmine object.  ex. jasmine.clock
  _.extend(self.jasmine, {
    addCustomEqualityTester: function(tester) {
      return env.addCustomEqualityTester(tester)
    },

    addMatchers: function(matchers) {
      return env.addMatchers(matchers)
    },

    clock: function() {
      return env.clock
    }
  })

  // extend the global context itself.  ex.  describe(...)
  _.extend(this, {
    describe: function(description, specDefinitions) {
      return env.describe(description, specDefinitions)
    },

    xdescribe: function(description, specDefinitions) {
      return env.xdescribe(description, specDefinitions)
    },

    it: function(desc, func) {
      return env.it(desc, func)
    },

    xit: function(desc, func) {
      return env.xit(desc, func)
    },

    beforeEach: function(beforeEachFunction) {
      return env.beforeEach(beforeEachFunction)
    },

    afterEach: function(afterEachFunction) {
      return env.afterEach(afterEachFunction)
    },

    expect: function(actual) {
      return env.expect(actual)
    },

    spyOn: function(obj, methodName) {
      return env.spyOn(obj, methodName)
    },

    jsApiReporter: new self.jasmine.JsApiReporter({
      timer: new self.jasmine.Timer()
    })
  })
}
