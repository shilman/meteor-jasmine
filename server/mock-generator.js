// goal: write all package metadata to file so we can create
// the package mocks when running out-of-context

var ComponentMocker = Npm.require('component-mocker'),
    fs = Npm.require('fs'),
    _ = Npm.require('lodash'),
    path = Npm.require('path'),
    mkdirp = Npm.require('mkdirp'),
    writeFile = Meteor._wrapAsync(fs.writeFile),
    packageMetadata = {}

function shouldIgnore (packageName) {
  var packagesToIgnore = ['meteor', 'MongoInternals']

  return _.contains(packagesToIgnore, packageName)
}

Meteor.startup(function () {

  /*
    Package = {
      "meteor": {
        "Meteor": {
          // ...
        }
      }
      "roles": {
        "Roles": {...}
      },
      "iron-router": {
        "Router": {...}
      }
    }
  */

  _.each(Package, function (packageObj, name) {
    if (!shouldIgnore(name)) {
      var packageExports = {}

      _.forOwn(packageObj, function (packageExportObj, packageExportName) {
        try {
          packageExports[packageExportName] = ComponentMocker.getMetadata(packageExportObj)
        } catch (error) {
          console.error('Could not mock the export ' + packageExportName +
            ' of the package ' + name + '. Will continue anyway.')
        }
      })

      packageMetadata[name] = packageExports
    }
  })

  // Initially load the global stubs for app code
  writeMetadataToFile(
    packageMetadata,
    Assets.getText('server/package-stubs.js.tpl'),
    'tests/jasmine/server/unit/package-stubs.js'
  )

  // Mocks the globals after each tests
  writeMetadataToFile(
    packageMetadata,
    Assets.getText('server/metadata-reader.js.tpl'),
    'tests/jasmine/server/unit/packageMocksSpec.js'
  )

  function writeMetadataToFile(metadata, template, destination) {
    var output = _.template(template, {
      METADATA: JSON.stringify(metadata, null, '  ')
    })

    var outputPath = path.join(process.env.PWD, destination)
    mkdirp.sync(path.dirname(outputPath))
    writeFile(outputPath, output, {encoding: 'utf8'})
  }
})  // end Meteor.startup
