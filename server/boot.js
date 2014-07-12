var fs = Npm.require('fs');
var util = Npm.require('util');
var path = Npm.require('path');

// boot code for jasmine
var jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js');
var jasmine = jasmineRequire.core(jasmineRequire);

var consoleFns = Npm.require('jasmine-core/lib/console/console.js');
extend(jasmineRequire, consoleFns);
jasmineRequire.console(jasmineRequire, jasmine);

var env = jasmine.getEnv();

var jasmineInterface = {
  describe: function(description, specDefinitions) {
    return env.describe(description, specDefinitions);
  },

  xdescribe: function(description, specDefinitions) {
    return env.xdescribe(description, specDefinitions);
  },

  it: function(desc, func) {
    return env.it(desc, func);
  },

  xit: function(desc, func) {
    return env.xit(desc, func);
  },

  beforeEach: function(beforeEachFunction) {
    return env.beforeEach(beforeEachFunction);
  },

  afterEach: function(afterEachFunction) {
    return env.afterEach(afterEachFunction);
  },

  expect: function(actual) {
    return env.expect(actual);
  },

  spyOn: function(obj, methodName) {
    return env.spyOn(obj, methodName);
  },

  jsApiReporter: new jasmine.JsApiReporter({
    timer: new jasmine.Timer()
  })
};

extend(global, jasmineInterface);

function extend(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
}

jasmine.addCustomEqualityTester = function(tester) {
  env.addCustomEqualityTester(tester);
};

jasmine.addMatchers = function(matchers) {
  return env.addMatchers(matchers);
};

jasmine.clock = function() {
  return env.clock;
};

// Jasmine "runner"
function executeSpecs(specs, done, isVerbose, showColors) {
  global.jasmine = jasmine;

  for (var i = 0; i < specs.length; i++) {
    var filename = specs[i];
    Npm.require(filename.replace(/\.\w+$/, ""));
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
  return getFiles(dir, new RegExp("\\.js$"));
}

// options from command line
var isVerbose = true;
var showColors = true;

runServerTests = function () {
  var specs = getSpecFiles(path.join(Velocity.getTestsPath(), 'jasmine', 'server'));

  executeSpecs(specs, function(passed) {
    if (passed) {
      console.log('Jasmine tests passed');
    } else {
      console.log('Jasmine tests did not pass');
    }
  }, isVerbose, showColors);
};
