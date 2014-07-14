/**
 * Create stubs for each template defined in the Meteor app.
 */
var DEBUG = process.env.DEBUG,
  templateNames = htmlScanner.findTemplateNames(),
  i = templateNames.length - 1;

for (; i >= 0; i--) {
  DEBUG && console.log('stubbing template:', templateNames[i]);
  Template.stub(templateNames[i]);
}
