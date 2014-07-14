/**
 * This runs before each unit test and resets the stubs.
 */

beforeEach(function () {
  MeteorStubs.install();
  loadStubs();
});


/* This doesn't work with Meteor.Collection

globalBackup = {};

ignoredGlobals = [
  'ignoredGlobals',
  'globalBackup',
  'jasmine',
  'global',
  'process',
  'console',
  'Buffer',
  'require',
  'module',
  'exports',
  'clearTimeout',
  'setInterval',
  'clearInterval'
];

beforeEach(function clearContext() {
  globalBackup = {};
  for (var key in global) {
    if (global.hasOwnProperty(key) && ignoredGlobals.indexOf(key) === -1) {
      globalBackup[key] = _lodash.clone(global[key], true);
    }
  }

  MeteorStubs.install();
  loadStubs();
});

afterEach(function () {
  var key;

  for (key in global) {
    if (global.hasOwnProperty(key) && ignoredGlobals.indexOf(key) === -1) {
      delete global[key];
    }
  }

  for (key in globalBackup) {
    global[key] = globalBackup[key];
  }
});
*/

describe('global', function () {
  it('MeteorStubs should be global.MeteorStubs', function () {
    expect(MeteorStubs).toBe(global.MeteorStubs);
  });

  it('declaring a new global variable should also add it to global', function () {
    foo1 = 'bar';
    expect(global.foo1).toBe('bar');
  });

  it('declaring a property on global should create a global variable', function () {
    global.foo2 = 'bar';
    expect(foo2).toBe('bar');
  });

  it('should delete global variable', function () {
    foo3 = 'bar';
    delete global.foo3;
    expect(typeof foo3).toBe('undefined');
  });
});
