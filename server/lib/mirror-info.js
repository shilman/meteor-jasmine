/* global
  VelocityMirrors: false
 */

Meteor.methods({
  jasmineIsMirror: function () {
    return {
      isMirror: process.env.IS_MIRROR,
      parentUrl: process.env.PARENT_URL
    }
  }
})

if (!process.env.IS_MIRROR) {
  Meteor.methods({
    jasmineMirrorInfo: function () {
      return VelocityMirrors.findOne({name: 'mocha-web'})
    }
  })
}
