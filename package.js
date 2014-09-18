/* jshint camelcase: false */
/* global
   Package: false
 */

Package.describe({
  name: 'sanjo:jasmine',
  summary: 'Easily use Jasmine in Meteor',
  version: '0.2.4',
  git: 'https://github.com/Sanjo/meteor-jasmine.git'
})

Npm.depends({
  'jasmine-core': '2.0.0',
  'meteor-stubs': '0.0.2',
  'component-mocker': '0.2.0',
  'lodash': '2.4.1',
  'mkdirp': '0.5.0',
  'glob': '3.2.9',
  'rimraf': '2.2.8',
  'coffee-script': '1.7.1'
})

Package.on_use(function (api) {
  if (api.versionsFrom) {
    api.versionsFrom("METEOR@0.9.1");
    api.use([
      'velocity:core@0.2.0',
      'alanning:package-stubber@0.0.9'
    ], 'server')
  } else {
    api.use([
      'velocity',
      'package-stubber'
    ], 'server')
  }
  api.use(['templating'], 'client')

  api.add_files([
    'server/main.js',
    'server/mock-generator.js',
    'server/server.js',
    'common/reporter.js',
    'server/runFileInContext.js',
    'server/lib/coffee-require.js',
    'server/lib/file-loader.js',
    'server/lib/html-scanner.js',
    'server/lib/load-order-sort.js',
    'server/lib/stub-loader.js',
    'server/boot.js',
    'server/fileCopier.js'
  ], 'server')

  api.add_files([
    '.npm/package/node_modules/component-mocker/index.js',
    '.npm/package/node_modules/meteor-stubs/index.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
    '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
    'common/reporter.js',
    'client/boot.js',
    'common/mocker.js'
  ], 'client')

  api.add_files([
    'server/metadata-reader.js.tpl',
    'common/mocker.js',
    'server/contextSpec.js'
  ], 'server', {isAsset: true})
})
