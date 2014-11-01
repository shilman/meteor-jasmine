/* global
   logError: false
 */

var fs = Npm.require('fs'),
    readFile = wrapAsync(fs.readFile)

runCodeInContext = function (code, context, filename) {
  try {
    context.run(code, filename)
  } catch(error) {
    logError('The code has syntax errors.', error)
  }
}

runFileInContext = function (filename, context) {
  var code = readFile(filename, {encoding: 'utf8'})
  try {
    context.run(code, filename)
  } catch(error) {
    logError('The file "' + filename + '" has syntax errors.', error)
  }
}
