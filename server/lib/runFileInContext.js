/* global
   logError: falses
 */

var vm = Npm.require('vm'),
    fs = Npm.require('fs'),
    readFile = Meteor._wrapAsync(fs.readFile)

runCodeInContext = function (code, context, prefix) {
  try {
    vm.runInContext(code, context)
  } catch(error) {
    console.error.apply(console, prefix +'The code has syntax errors.')
  }
}

runFileInContext = function (filename, context, prefix) {
  var code = readFile(filename, {encoding: 'utf8'})
  try {
    vm.runInContext(code, context, filename)
  } catch(error) {
    console.error.apply(console, prefix + 'The file "' + filename + '" has syntax errors.')
  }
}
