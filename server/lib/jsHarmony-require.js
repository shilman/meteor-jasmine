/*jshint -W117 */
/* global
 */

// jsHarmonyRequire
var fs = Npm.require('fs'),
    path = Npm.require('path'),
    traceur = Npm.require('traceur'),
    os = Npm.require('os'),
    coffee = Npm.require('coffee-script')

/**
 * A js-next harmony processor that transpiles js6 harmony files to js
 *
 * @method jsHarmonyPreprocessor
 * @param {Object} options to pass directly to the coffee-script compiler. See here
 */
var jsHarmonyPreprocessor = function (options, content, file, done) {

  var oldPath = file.originalPath;
  var moduleName = file.originalPath.replace(/\.next\.js$/, '');

  var traceurOptions = {
    filename: oldPath,
    sourceMap: true,
    modules: 'instantiate',
    moduleName: moduleName,
    types: true,
    typeAssertions: true,
    annotations: true
  };

  var result = traceur.compile(content, traceurOptions);

  if (result.errors.length) {
    return done(result.errors.join(os.EOL));
  }

  var map;
  if (result.sourceMap) {
    map = JSON.parse(result.sourceMap)
    map.sources[0] = path.basename(file.originalPath)
    map.sourcesContent = [content]
    map.file = path.basename(file.originalPath.replace(/\.next.js/, '.js'))
    file.sourceMap = map
    dataUri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64')
    done(null, result.js + '\n//@ sourceMappingURL=' + dataUri + '\n')
  } else {
    done(null, result.js || result)
  }

  /*
  var result = null
  var map
  var dataUri

  // Clone the options because coffee.compile mutates them
  var opts = _.clone(options)

  try {
    result = coffee.compile(content, opts)
  } catch (e) {
    console.log('%s\n  at %s:%d', e.message, file.originalPath, e.location.first_line)
    return done(e, null)
  }

  if (result.v3SourceMap) {
    map = JSON.parse(result.v3SourceMap)
    map.sources[0] = path.basename(file.originalPath)
    map.sourcesContent = [content]
    map.file = path.basename(file.originalPath.replace(/\.coffee$/, '.js'))
    file.sourceMap = map
    dataUri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64')
    done(null, result.js + '\n//@ sourceMappingURL=' + dataUri + '\n')
  } else {
    done(null, result.js || result)
  }
  */
}

/**
 * Load and execute a javascript-next (ES6 harmony) file.
 *
 * @method jsHarmonyRequire
 * @param {String} target Path to javascript file to load.
 * @param {Object} context the context to run the CoffeeScript code within.
 */
jsHarmonyRequire = function (target, context) {
  var file = {originalPath: target},
      code = fs.readFileSync(target).toString()

  jsHarmonyPreprocessor({}, code, file, function (err, code) {
    if (!err) {
      runCodeInContext(code, context, target)
    } else {
      logError(err)
    }
  })
}
