// stub loader

var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    path = Npm.require('path'),
    glob = Npm.require('glob'),
    vm = Npm.require('vm')

stubLoader = {

  /**
   * Load framework-supplied stubs.
   *
   * @method loadFrameworkStubs
   */
  loadFrameworkStubs: function (context) {
    vm.runInContext('MeteorStubs.install(global)', context)
  },

  /**
   * Load user-defined stubs.  Stub files should be located in the 'tests'
   * directory and end in `-stub.js` or `-stubs.js`.
   *
   * Example:
   *   tests/custom-stub.js
   *   tests/custom-stubs.js
   *
   * @method loadUserStubs
   */
  loadUserStubs: function (context) {
    _loadStubs('tests', context)
  },

}

function _loadStubs (dir, context) {
  var cwd = path.join(PWD, dir),
      files, i

  files = glob.sync('**/*-stub.js', { cwd: cwd })
  for (i in files) {
    DEBUG && console.log('loading stub file:', files[i])
    runFileInContext(path.join(PWD, dir, files[i]), context)
  }

  files = glob.sync('**/*-stubs.js', { cwd: cwd })
  for (i in files) {
    DEBUG && console.log('loading stub file:', files[i])
    runFileInContext(path.join(PWD, dir, files[i]), context)
  }
}
