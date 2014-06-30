/* global
  TEST_FRAMEWORK_NAME: false
 */

var ddpParentConnection = null;
var parentUrl = null;

Meteor.startup(function(){
  parentUrl = process.env.PARENT_URL;
  ddpParentConnection = DDP.connect(parentUrl);
});

Meteor.methods({
  jasmineMirrorInfo: function() {
    return {
      isMirror: process.env.IS_MIRROR,
      parentUrl: process.env.PARENT_URL
    };
  },

  jasmineMarkClientTestsCompleted: function() {
    markTestsCompleted();
  }
});

function markTestsCompleted(){
  ddpParentConnection.call('completed', {framework: TEST_FRAMEWORK_NAME});
}
