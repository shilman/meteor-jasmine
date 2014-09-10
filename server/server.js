/* global
  TEST_FRAMEWORK_NAME: false
 */

var ddpParentConnection = null
var parentUrl = null
var areClientTestsCompleted = false
var areServerTestsCompleted = false

Meteor.startup(function(){
  parentUrl = process.env.PARENT_URL
  if (parentUrl) {
    ddpParentConnection = DDP.connect(parentUrl)
  }
})

Meteor.methods({
  jasmineMirrorInfo: function() {
    return {
      isMirror: process.env.IS_MIRROR,
      parentUrl: process.env.PARENT_URL
    }
  },

  jasmineMarkClientTestsCompleted: function() {
    areClientTestsCompleted = true
    checkAndMarkTestsCompleted()
  },

  jasmineMarkServerTestsCompleted: function () {
    areServerTestsCompleted = true
    checkAndMarkTestsCompleted()
  }
})

function clientTestsExist() {
  return VelocityTestFiles.find({
    targetFramework: TEST_FRAMEWORK_NAME,
    isClient: true
  }).count() > 0
}

function serverTestsExist() {
  return VelocityTestFiles.find({
    targetFramework: TEST_FRAMEWORK_NAME,
    isServer: true
  }).count() > 0
}

function haveTestsCompleted() {
  return (areClientTestsCompleted || !clientTestsExist()) &&
         (areServerTestsCompleted || !serverTestsExist())
}

function checkAndMarkTestsCompleted() {
  if (haveTestsCompleted()) {
    var connection = ddpParentConnection || Meteor
    connection.call('completed', {framework: TEST_FRAMEWORK_NAME})
  }
}
