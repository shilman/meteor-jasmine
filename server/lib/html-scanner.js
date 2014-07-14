htmlScanner = {

  /**
   * Scan all html files in Meteor app and return list of template names.
   *
   * @method findTemplateNames
   * @param {String} [targetDir] Optional path to directory to scan.  Default = PWD
   * @return {Array} list of template names
   */
  findTemplateNames: function (targetDir) {
    var PWD = process.env.PWD,
        fs = Npm.require('fs'),
        path = Npm.require('path'),
        glob = Npm.require('glob'),
        _ = Npm.require('lodash'),
        files,
        templateNames,
        templateTag;

    files = glob.sync('**/*.html', { cwd: targetDir || PWD });

    templateNames = [];

    // templateTag regex matches html tags like:
    //   <template name='test'>
    //
    templateTag = /^<template\s+name=(['"]).*?\1/igm;


    _.each(files, function (filename) {
      var fileContents = fs.readFileSync(path.join(PWD, filename), 'utf-8'),
          matches = fileContents.match(templateTag);

      if (matches) {
        _.each(matches, function (match) {
          var name = match.substring(match.indexOf('name=') + 6, match.length - 1);
          templateNames.push(name);
        });
      }
    });

    return templateNames;
  }
};
