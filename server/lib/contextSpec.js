beforeEach(function () {
  MeteorStubs.install()
  Meteor.isServer = true
  Meteor.isClient = false
  Meteor.settings = __jasmine.Meteor.settings
})

afterEach(function () {
  MeteorStubs.uninstall()
})
