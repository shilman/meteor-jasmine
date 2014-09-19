/* jshint camelcase: false */
/* global
   Package: false
 */

Package.describe({
  name: 'sanjo:jasmine',
  summary: 'Easily use Jasmine in Meteor',
  version: '0.2.5',
  git: 'https://github.com/Sanjo/meteor-jasmine.git'
})

Npm.depends({
  'jasmine-core': '2.0.0',
  'meteor-stubs': '0.0.2',
  'component-mocker': '0.2.0',
  'mkdirp': '0.5.0',
  'glob': '3.2.9',
  'rimraf': '2.2.8',
  'coffee-script': '1.7.1'
})

Package.on_use(function (api) {
  var both = ['server', 'client']

  if (api.versionsFrom) {
    api.versionsFrom("METEOR@0.9.1");
    api.use('underscore', both)
    api.use([
      'velocity:core@0.2.0',
      'alanning:package-stubber@0.0.9'
    ], 'server')
  } else {
    api.use('underscore', both)
    api.use([
      'velocity',
      'package-stubber'
    ], 'server')
  }
  api.use(['templating'], 'client')


  api.add_files([
    'lib/logHelpers.js',
    'lib/JasmineTestFramework.js',
    'lib/JasmineInterface.js',
    'lib/VelocityTestReporter.js'
  ], both)

  // setup each framework
  //   load jasmine files
  // load jasmine-velocity reporter
  // [unit] mock packages
  // execute tests
  // report results


  api.add_files('server/metadata-reader.js.tpl', 'server', {isAsset: true})

  // Files that are needed in the mirror

  // Client side integration testing
  api.add_files([
    '.npm/package/node_modules/component-mocker/index.js',
    '.npm/package/node_modules/meteor-stubs/index.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
    'client/integration/ClientIntegrationTestFramework.js',
    'client/integration/clientside-setup.js',
    'lib/mock.js'
  ], 'client')

  api.add_files([
    // set up server-side Meteor methods
    'server/lib/mirror-info.js'
  ], 'server')

  // Files that are needed in the main app

  api.add_files([
    'server/lib/runFileInContext.js',
    'server/lib/coffee-require.js',
    'server/lib/file-loader.js',
    'server/lib/html-scanner.js',
    'server/lib/load-order-sort.js',
    'server/lib/stub-loader.js',
    //'server/jasmine-setup.js',

    'server/unit/mock-generator.js',
    'server/unit/ServerUnitTestFramework.js',
    'client/integration/ClientIntegrationTestFramework.js',

    'server/lib/get-files.js',
    'registerFrameworks.js'
  ], 'server')

  // Assets

  api.add_files([
    'server/package-stubs.js.tpl',
    'server/metadata-reader.js.tpl',
    'lib/mock.js',
    'server/lib/contextSpec.js'
  ], 'server', {isAsset: true})

})
