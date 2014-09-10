beforeEach(function () {
  MeteorStubs.install()
  Meteor.isServer = true
  Meteor.isClient = false
})

afterEach(function () {
  MeteorStubs.uninstall()
})
