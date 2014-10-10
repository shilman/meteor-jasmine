// stub loader

var path = Npm.require('path'),
    glob = Npm.require('glob')

stubLoader = {
  /**
   * Load user-defined stubs.  Stub files should be located in the 'tests'
   * directory and end in `-stub.js`, `-stubs.js`, `-stub.coffee`, or `-stubs.coffee`.
   *
   * Example:
   *   tests/custom-stub.js
   *   tests/custom-stubs.js
   *   tests/custom-stub.coffee
   *   tests/custom-stubs.coffee
   *
   * @method loadUserStubs
   */
  loadUserStubs: function (context) {
    this._loadStubs('tests/jasmine', context)
  },

  getStubFiles: function (basePath) {
    var files = glob.sync('**/*-stub{s,}.{js,coffee}', { cwd: basePath })
    files = files.map(function (file) {
      return path.join(basePath, file)
    })
    return files
  },

  _loadStubs: function (dir, context) {
    var cwd = path.join(process.env.PWD, dir)

    this.getStubFiles(cwd).forEach(function (file) {
      debug('loading stub file:', file)
      fileLoader.loadFile(file, context)
    })
  }
}
