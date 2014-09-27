/* jshint camelcase: false */
/* global
   Package: false
 */

Package.describe({
  name: 'sanjo:jasmine',
  summary: 'Easily use Jasmine in Meteor',
  version: '0.4.2',
  git: 'https://github.com/Sanjo/meteor-jasmine.git'
})

Npm.depends({
  'jasmine-core': '2.0.0',
  'meteor-stubs': '0.0.5',
  'component-mocker': '0.2.0',
  'mkdirp': '0.5.0',
  'glob': '3.2.9',
  'rimraf': '2.2.8',
  'coffee-script': '1.7.1'
})

Package.onUse(function (api) {
  api.versionsFrom("METEOR@0.9.1");
  api.use('underscore', ['server', 'client'])
  api.use([
    'velocity:core@0.2.14',
    'alanning:package-stubber@0.0.9'
  ], 'server')


  api.addFiles([
    'lib/logHelpers.js',
    'lib/JasmineTestFramework.js',
    'lib/JasmineInterface.js',
    'lib/VelocityTestReporter.js'
  ], ['server', 'client'])

  // ----------------------------------------
  // Files that are needed in the mirror
  // ----------------------------------------

  // Client side integration testing
  api.addFiles([
    '.npm/package/node_modules/component-mocker/index.js',
    '.npm/package/node_modules/meteor-stubs/index.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
    'client/integration/ClientIntegrationTestFramework.js',
    'client/integration/clientsideSetup.js',
    'lib/mock.js'
  ], 'client')

  api.addFiles([
    // set up server-side Meteor methods
    'server/lib/mirror-info.js'
  ], 'server')

  // ----------------------------------------
  // Files that are needed in the main app
  // ----------------------------------------

  api.addFiles([
    'server/lib/runFileInContext.js',
    'server/lib/coffee-require.js',
    'server/lib/file-loader.js',
    'server/lib/html-scanner.js',
    'server/lib/load-order-sort.js',
    'server/lib/stub-loader.js',

    'server/unit/included-packages.js',
    'server/unit/mock-generator.js',
    'server/unit/ServerUnitTestFramework.js',
    'client/integration/ClientIntegrationTestFramework.js',

    'server/lib/get-files.js',
    'registerFrameworks.js'
  ], 'server')

  // ----------------------------------------
  // Assets
  // ----------------------------------------

  api.addFiles([
    'server/unit/package-stubs.js.tpl',
    'server/unit/metadata-reader.js.tpl',
    'lib/mock.js',
    'server/lib/contextSpec.js'
  ], 'server', {isAsset: true})

})
