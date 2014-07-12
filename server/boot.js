/* global
 runServerTests: true,
 VelocityTestReporter: false
 */

var fs = Npm.require('fs');
var readFile = Meteor._wrapAsync(fs.readFile);
var util = Npm.require('util');
var path = Npm.require('path');
var vm = Npm.require('vm');

// boot code for jasmine
var jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js');
var jasmine = jasmineRequire.core(jasmineRequire);

var consoleFns = Npm.require('jasmine-core/lib/console/console.js');
extend(jasmineRequire, consoleFns);
jasmineRequire.console(jasmineRequire, jasmine);

var isRunning = false;

var jasmineInterface = {
  describe: function(description, specDefinitions) {
    return jasmine.getEnv().describe(description, specDefinitions);
  },

  xdescribe: function(description, specDefinitions) {
    return jasmine.getEnv().xdescribe(description, specDefinitions);
  },

  it: function(desc, func) {
    return jasmine.getEnv().it(desc, func);
  },

  xit: function(desc, func) {
    return jasmine.getEnv().xit(desc, func);
  },

  beforeEach: function(beforeEachFunction) {
    return jasmine.getEnv().beforeEach(beforeEachFunction);
  },

  afterEach: function(afterEachFunction) {
    return jasmine.getEnv().afterEach(afterEachFunction);
  },

  expect: function(actual) {
    return jasmine.getEnv().expect(actual);
  },

  spyOn: function(obj, methodName) {
    return jasmine.getEnv().spyOn(obj, methodName);
  },

  jsApiReporter: new jasmine.JsApiReporter({
    timer: new jasmine.Timer()
  })
};

extend(global, jasmineInterface);

jasmine.addCustomEqualityTester = function(tester) {
  jasmine.getEnv().addCustomEqualityTester(tester);
};

jasmine.addMatchers = function(matchers) {
  return jasmine.getEnv().addMatchers(matchers);
};

jasmine.clock = function() {
  return jasmine.getEnv().clock;
};

runServerTests = function () {
  if (isRunning) {
    return;
  }

  isRunning = true;

  // Force to create a new Env
  jasmine.currentEnv_ = null;

  // options from command line
  var isVerbose = true;
  var showColors = true;

  var specs = getSpecFiles(path.join(Velocity.getTestsPath(), 'jasmine', 'server'));

  executeSpecs(specs, function () {
    isRunning = false;
  }, isVerbose, showColors);
};

function extend(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

// Jasmine "runner"
function executeSpecs(specs, done, isVerbose, showColors) {
  global.jasmine = jasmine;

  for (var i = 0; i < specs.length; i++) {
    var filename = specs[i];
    // Using vm.runInThisContext instead of require
    // will always freshly load the tests from the file
    var code = readFile(filename, {encoding: 'utf8'});
    vm.runInThisContext(code, filename);
  }

  var env = jasmine.getEnv();
  var consoleReporter = new jasmine.ConsoleReporter({
    print: util.print,
    onComplete: done,
    showColors: showColors,
    timer: new jasmine.Timer()
  });

  var velocityReporter = new VelocityTestReporter({
    env: env,
    timer: new jasmine.Timer()
  });

  env.addReporter(consoleReporter);
  env.addReporter(velocityReporter);
  env.execute();
}

function getFiles(dir, matcher) {
  var allFiles = [];

  if (fs.statSync(dir).isFile() && dir.match(matcher)) {
    allFiles.push(dir);
  } else {
    var files = fs.readdirSync(dir);
    for (var i = 0, len = files.length; i < len; ++i) {
      var filename = dir + '/' + files[i];
      if (fs.statSync(filename).isFile() && filename.match(matcher)) {
        allFiles.push(filename);
      } else if (fs.statSync(filename).isDirectory()) {
        var subfiles = getFiles(filename);
        subfiles.forEach(function(result) {
          allFiles.push(result);
        });
      }
    }
  }
  return allFiles;
}

function getSpecFiles(dir) {
  return getFiles(dir, new RegExp('\\.js$'));
}
