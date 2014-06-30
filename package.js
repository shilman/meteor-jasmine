/* jshint camelcase: false */
/* global
   Package: false
 */

Package.describe({
  summary: 'Run Jasmine tests in the browser'
});

Npm.depends({
  'fs.extra': '1.2.1',
  'jasmine-core': '2.0.0'
});

Package.on_use(function (api) {
  console.log('===> NODE_ENV', process.env.NODE_ENV);
  console.log('===> IS_MIRROR', process.env.IS_MIRROR);
  console.log('===> PROGRAM', process.argv[0]);
  if (true || process.env.NODE_ENV === 'development') {
    api.use(['velocity'], 'server');
    api.use(['templating'], 'client');

    api.add_files(['server/main.js'], 'server');

    if (process.env.IS_MIRROR) {
      api.add_files([
        '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
        '.npm/package/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
        'client/reporter.js',
        'client/boot.js'
      ], 'client');

      api.add_files([
        'server/server.js'
      ], 'server');
    } else {
      console.log('Add fileCopier');
      api.add_files([
        'server/fileCopier.js'
      ], 'server');
    }
  } else {
    // Show the developer a hint when the Meteor app is not packed.
    var program = process.argv[0];
    if (program.indexOf('.meteor/tools') !== -1) {
      console.log('WARNING: Jasmine will not run the tests because NODE_ENV is not set to "development"!');
    }
  }
});
