// definition of the global console reporter

if (Meteor.isServer) {
  var util = Npm.require('util'),
    jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js'),
    consoleFns = Npm.require('jasmine-core/lib/console/console.js');

  _.extend(jasmineRequire, consoleFns);

  var jasmine = jasmineRequire.core(jasmineRequire)
  jasmineRequire.console(jasmineRequire, jasmine);

  var id = 0;

  getJasmineConsoleReporter = function(searchString, showMessage) {
    // override original behavior to cut stack trace (dirty, in order not to modify the console)
    var consoleReporter = new jasmine.ConsoleReporter({
      print: util.print,
      showColors: true,
      timer: new jasmine.Timer()
    });
    consoleReporter.id = id++;

    var originalReport = consoleReporter.specDone;
    var that = this;
    consoleReporter.specDone = function(result) {
      var indent = function(str) {
        if (str[0] != " ") str = "  " + str;
        return str.replace("    ", "  ");
      }

      if (result.status == "failed" && result.failedExpectations.length > 0) {
        // simplify stack trace
        for (var i = 0; i < result.failedExpectations.length; i++) {
          var failedExpectation = result.failedExpectations[i];

          if (failedExpectation.stack) {
            var newStack = "",
              reg = new RegExp(".*" + searchString + ".*");

            failedExpectation.stack.split("\n").every(function(elem) {
              // when we find the stack trace part with the search string we can finish
              if (elem.match(reg)) {
                newStack += elem + "\n";
                return false;
              }
              // we add all non-jasmine framework element lines containing stack information
              if (!elem.match(/sanjo[:_-]jasmine/) && elem.match(/^ *at/)) {
                newStack += elem + "\n";
              }
              return true;
            });

            // rebuild the stack
            failedExpectation.stack = "Error: " +
              failedExpectation.message + "\n" +
                newStack;

          } else {
            // in case there is no stack we only show the message
            failedExpectation.stack = "Error: " + failedExpectation.message + "\n  No stack trace available.";
          }
        }
      }
      originalReport(result);
    }

    return consoleReporter;
  }
}

JasmineTestFramework = function (options) {
  if (!options || !options.name) {
    throw new Error("[JasmineTestFramework] Missing required field 'name'")
  }

  if (!options.regex) {
    throw new Error("[JasmineTestFramework] Missing required field 'regex'")
  }

  if (_.isUndefined(options.jasmineRequire)) {
    throw new Error("[JasmineTestFramework] Missing required field 'jasmineRequire'")
  }

  this.name = options.name
  this.regex = options.regex
  this.sampleTestGenerator = options.sampleTestGenerator
  this.logPrefix = options.logPrefix || '[' + this.name + '] '
  this.jasmineRequire = options.jasmineRequire

  // load jasmine-velocity reporter
  // [unit] mock packages

}

_.extend(JasmineTestFramework.prototype, {

  //////////////////////////////////////////////////////////////////////
  // Public functions
  //

  runTests: function () {},

  //////////////////////////////////////////////////////////////////////
  // Protected functions
  //

  registerWithVelocity: function () {
    Velocity.registerTestingFramework(this.name, {
      regex: this.regex,
      sampleTestGenerator: this.sampleTestGenerator
    })
  }

})
