/* global
  TEST_FRAMEWORK_NAME: false,
  VelocityMirrors: false
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
    var mirrorUrl
    if (process.env.IS_MIRROR) {
      mirrorUrl = process.env.ROOT_URL
    } else {
      var mirrorInfo = VelocityMirrors.findOne({name: 'mocha-web'})
      if (mirrorInfo) {
        mirrorUrl = mirrorInfo.rootUrl
      } else {
        logInfo('The client tests will only run when you reload the app ' +
                'in the browser after the mirror app has started.')
      }
    }
    return {
      isMirror: process.env.IS_MIRROR,
      mirrorUrl: mirrorUrl,
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
