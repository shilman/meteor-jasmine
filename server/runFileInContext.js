/* global
   logError: falses
 */

var fs = Npm.require('fs')
var readFile = Meteor._wrapAsync(fs.readFile)
var vm = Npm.require('vm')

runCodeInContext = function (code, context) {
  try {
    vm.runInContext(code, context)
  } catch(error) {
    logError('The code has syntax errors.')
  }
}

runFileInContext = function (filename, context) {
  var code = readFile(filename, {encoding: 'utf8'})
  try {
    vm.runInContext(code, context, filename)
  } catch(error) {
    logError('The file "' + filename + '" has syntax errors.')
  }
}

runFileInThisContext = function (filename) {
  var code = readFile(filename, {encoding: 'utf8'})
  return vm.runInThisContext(code, filename)
}
