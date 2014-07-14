var fs = Npm.require('fs');
var readFile = Meteor._wrapAsync(fs.readFile);
var vm = Npm.require('vm');

runFileInContext = function (filename, context) {
  var code = readFile(filename, {encoding: 'utf8'});
  return vm.runInContext(code, context, filename);
};

runFileInThisContext = function (filename) {
  var code = readFile(filename, {encoding: 'utf8'});
  return vm.runInThisContext(code, filename);
};
