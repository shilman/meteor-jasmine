/**
 * Copies test files to the mirror reactively.
 */

/* global
   TEST_FRAMEWORK_NAME: false,
   debug: false
 */

var path = Npm.require('path');
var fs = Npm.require('fs.extra');
var fileExists = Meteor._wrapAsync(fs.exists);
var removeFile = Meteor._wrapAsync(fs.unlink);
var copyFile = Meteor._wrapAsync(fs.copy);
var makeDir = Meteor._wrapAsync(fs.mkdirRecursive);

Meteor.startup(function () {
  var testFilesCursor = VelocityTestFiles.find({
    targetFramework: TEST_FRAMEWORK_NAME
  });

  testFilesCursor.observe({
    added: replaceFileInMirror,
    changed: function (newFile, oldFile) {
      removeFileFromMirror(oldFile);
      replaceFileInMirror(newFile);
    },
    removed: removeFileFromMirror
  });
});

function removeFileFromMirror(file) {
  var mirrorFilePath = convertTestsPathToMirrorPath(file.absolutePath);
  debug('Remove file from mirror', mirrorFilePath);
  removeFile(mirrorFilePath);
}

function replaceFileInMirror(file) {
  var mirrorFilePath = convertTestsPathToMirrorPath(file.absolutePath);
  debug('Replace file in mirror', mirrorFilePath);
  if (fileExists(mirrorFilePath)) {
    removeFile(mirrorFilePath);
  } else {
    makeDir(path.dirname(mirrorFilePath));
  }
  copyFile(file.absolutePath, mirrorFilePath);
}

function isInTestsPath(filePath) {
  var testsPath = getTestsPath();
  return filePath.substr(0, testsPath.length) === testsPath;
}

function convertTestsPathToMirrorPath(filePath) {
  if (!isInTestsPath(filePath)) {
    throw new Error('Path "' + filePath + '" is not in the tests path.');
  }

  filePath = filePath.substr(getTestsPath().length);
  filePath = filePath.replace(TEST_FRAMEWORK_NAME + '/client', 'client/' + TEST_FRAMEWORK_NAME);
  filePath = filePath.replace(TEST_FRAMEWORK_NAME + '/server', 'server/' + TEST_FRAMEWORK_NAME);

  return getMirrorPath() + filePath;
}

function getMirrorPath() {
  return process.env.PWD + '/.meteor/local/.mirror';
}

function getTestsPath() {
  return process.env.PWD + '/tests';
}
