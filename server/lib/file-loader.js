var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    _ = Npm.require('lodash'),
    glob = Npm.require('glob');

fileLoader = {
  loadFiles: loadFiles,
  getJsFiles: getJsFiles,
  getCoffeeFiles: getCoffeeFiles,
  filterFiles: filterFiles,
  loadFile: loadFile
};

/**
 * Loads a Meteor app's javascript and coffeescript files.
 * Matches Meteor core's load order.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method loadFiles
 */
function loadFiles (context) {
  var files = _.union(getJsFiles(), getCoffeeFiles());

  files.sort(loadOrderSort([]));
  console.log('Load files', files);
  _.each(files, function (file) {
    loadFile(file, context);
  });
}

/**
 * Returns list of javascript filenames in Meteor app.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method getJsFiles
 * @return {Array.<String>} list of filenames
 */
function getJsFiles () {
  var files = glob.sync('**/*.js', { cwd: PWD });

  return filterFiles(files);
}

/**
 * Returns list of coffeescript files in Meteor app.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method getCoffeeFiles
 * @return {Array.<String>} list of filenames
 */
function getCoffeeFiles () {
  var files = glob.sync('**/*.coffee', { cwd: PWD });

  return filterFiles(files);
}

/**
 * Filters out any files in the following directories:
 *   private,
 *   public,
 *   programs,
 *   packages,
 *   tests
 *
 * @method filterFiles
 * @param {Array} files array of filenames to filter
 * @return {Array} filenames
 */
function filterFiles (files) {
  return _.filter(files, function (filepath) {
    var ignore = filepath.indexOf('tests') == 0 ||
                 filepath.indexOf('private') == 0 ||
                 filepath.indexOf('public') == 0 ||
                 filepath.indexOf('programs') == 0 ||
                 filepath.indexOf('packages') == 0;
    return !ignore;
  });
}

/**
 * Load and execute the target source file.
 * Will use node's 'require' if source file has a .js extension or
 * karma's coffeescript preprocessor if a .coffee extension
 *
 * @method loadFile
 * @param {String} target file path to load, relative to meteor app
 */
function loadFile (target, context) {
  var pwd = process.env.PWD,
      filename = path.join(pwd, target),
      ext;

  if (fs.existsSync(filename)) {
    ext = path.extname(filename);
    if ('.js' === ext) {
      DEBUG && console.log('loading source file:', filename);
      runFileInContext(filename, context);
    } else if ('.coffee' === ext) {
      DEBUG && console.log('loading source file:', filename);
      coffeeRequire(filename);
    }
  }
}
