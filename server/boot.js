/* global
 runServerTests: true,
 VelocityTestReporter: false
 */

var fs = Npm.require('fs');
var readFile = Meteor._wrapAsync(fs.readFile);
var util = Npm.require('util');
var path = Npm.require('path');
var vm = Npm.require('vm');
var _ = Npm.require('lodash');
Npm.require('meteor-stubs');

// boot code for jasmine
var jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js');
var jasmine = jasmineRequire.core(jasmineRequire);

var consoleFns = Npm.require('jasmine-core/lib/console/console.js');
_.extend(jasmineRequire, consoleFns);
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

function loadStubs(context) {
  var filename = path.join(Velocity.getTestsPath(), 'a1-package-stubs.js');
  var code = readFile(filename, {encoding: 'utf8'});
  code = ';loadStubs = function () {' + code + '};';
  return vm.runInContext(code, context, filename);
}

// Jasmine "runner"
function executeSpecs(specs, done, isVerbose, showColors) {
  var contextGlobal = {
    process: process,
    console: console,
    Buffer: Buffer,
    Npm: Npm,
    jasmine: jasmine,
    runFileInThisContext: runFileInThisContext,
    stubLoader: stubLoader,
    fileLoader: fileLoader,
    coffeeRequire: coffeeRequire,
    htmlScanner: htmlScanner,
    MeteorStubs: MeteorStubs
  };
  _.extend(contextGlobal, jasmineInterface);
  contextGlobal.global = contextGlobal;

  var context = vm.createContext(contextGlobal);

  var packagePath = path.join(process.env.PWD, 'packages', 'jasmine');

  // load stubs; auto-stub any templates found in Meteor app

  try {
    stubLoader.loadFrameworkStubs(context);
    runFileInContext(path.join(packagePath, 'server', 'lib', 'stubTemplates.js'), context);
    stubLoader.loadUserStubs(context);
  }
  catch (ex) {
    console.log('Error loading stubs', ex.message, ex.stack);
  }

  // load Meteor app source files prior to running tests

  try {
    fileLoader.loadFiles(context);
  }
  catch (ex) {
    console.log('Error loading app files', ex.message, ex.stack);
  }

  // Load context tests
  var contextCleanerPath = path.join(packagePath, 'common', 'contextSpec.js');
  runFileInContext(contextCleanerPath, context);

  for (var i = 0; i < specs.length; i++) {
    runFileInContext(specs[i], context);
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
