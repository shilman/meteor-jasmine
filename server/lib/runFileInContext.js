/* global
   logError: false
 */

var vm = Npm.require('vm'),
    fs = Npm.require('fs'),
    readFile = wrapAsync(fs.readFile)

runCodeInContext = function (code, context, filename) {
  try {
    vm.runInContext(code, context, filename)
  } catch(error) {
    logError('The code has syntax errors.', error)
  }
}

runFileInContext = function (filename, context) {
  var code = readFile(filename, {encoding: 'utf8'})
  try {
    vm.runInContext(code, context, filename)
  } catch(error) {
    logError('The file "' + filename + '" has syntax errors.', error)
  }
}
