/* global
  VelocityMirrors: false
 */

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
  }
})
