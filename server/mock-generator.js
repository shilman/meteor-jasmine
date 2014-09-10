// goal: write all package metadata to file so we can create
// the package mocks when running out-of-context

var ComponentMocker = Npm.require('component-mocker'),
    fs = Npm.require('fs'),
    _ = Npm.require('lodash'),
    path = Npm.require('path'),
    writeFile = Meteor._wrapAsync(fs.writeFile),
    packageMetadata = {},
    outfile = 'tests/jasmine/server/unit/packageMocksSpec.js'

function shouldIgnore (packageName) {
  var packagesToIgnore = ['meteor']

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
          packageExports[packageExportName] = ComponentMocker.getMetadata(packageObj)
        } catch (error) {
          console.error('Could not mock the export ' + packageExportName +
            ' of the package ' + name + '. Will continue anyway.')
        }
      })

      packageMetadata[name] = packageExports
    }
  })

  var template = Assets.getText('server/metadata-reader.js.tpl')
  var output = _.template(template, {
    METADATA: JSON.stringify(packageMetadata, null, '  ')
  })

  // write jasmine spec to file
  var outputPath = path.join(process.env.PWD, outfile)
  writeFile(outputPath, output, {encoding: 'utf8'})

})  // end Meteor.startup
