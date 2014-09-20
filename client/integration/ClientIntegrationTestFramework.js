/* global
 Velocity: false
 */

ClientIntegrationTestFramework = function (options) {
  options = options || {}

  _.defaults(options, {
    name: 'jasmine-client-integration',
    regex: 'jasmine/client/integration/.+\\.(js|coffee|litcoffee|coffee\\.md)$',
    jasmineRequire: Meteor.isClient ? window.jasmineRequire : null
  })

  JasmineTestFramework.call(this, options)

  if (Meteor.isClient) {
    this._setup()
  }
}

ClientIntegrationTestFramework.prototype = Object.create(JasmineTestFramework.prototype)

_.extend(ClientIntegrationTestFramework.prototype, {

  _setup: function () {
    this.jasmine = this.jasmineRequire.core(this.jasmineRequire)
    this.jasmineInterface = new JasmineInterface({jasmine: this.jasmine})
    _.extend(window, this.jasmineInterface)
  },

  startFileCopier: function () {
    var fileCopier = new Velocity.FileCopier({
      targetFramework: this.name,
      shouldCopy: function (filepath) {
        var isClient = filepath.absolutePath.indexOf('server') === -1

        return isClient
      }
    })
    fileCopier.start()
  },

  runTests: function () {
    /**
     * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
     */
    this.jasmineRequire.html(this.jasmine)

    /**
     * Create the Jasmine environment. This is used to run all specs in a project.
     */
    var env = jasmine.getEnv()

    /**
     * ## Runner Parameters
     *
     * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
     */

    var queryString = new this.jasmine.QueryString({
      getWindowLocation: function() { return window.location }
    })

    var catchingExceptions = queryString.getParam('catch')
    env.catchExceptions(typeof catchingExceptions === 'undefined' ? true : catchingExceptions)

    /**
     * ## Reporters
     */
    var velocityReporter = new VelocityTestReporter({
      mode: "Client Integration",
      framework: this.name,
      env: env,
      timer: new this.jasmine.Timer()
    })

    /**
     * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
     */
    env.addReporter(this.jasmineInterface.jsApiReporter)
    env.addReporter(velocityReporter)

    /**
     * Filter which specs will be run by matching the start of the full name against the `spec` query param.
     */
    var specFilter = new this.jasmine.HtmlSpecFilter({
      filterString: function() { return queryString.getParam('spec') }
    })

    env.specFilter = function(spec) {
      return specFilter.matches(spec.getFullName())
    }

    /**
     * Setting up timing functions to be able to be overridden. Certain browsers (Safari, IE 8, phantomjs) require this hack.
     */
    window.setTimeout = window.setTimeout
    window.setInterval = window.setInterval
    window.clearTimeout = window.clearTimeout
    window.clearInterval = window.clearInterval

    /**
     * ## Execution
     */
    window.ddpParentConnection = null
    window.jasmineWebClientTestsComplete = false

    Meteor.startup(function(){
      Meteor.call('jasmineMirrorInfo', function(error, mirrorInfo) {
        if (error) {
          throw error
        } else if (mirrorInfo.isMirror) {
          Meteor.setTimeout(function(){
            logInfo('Running Jasmine tests')
            window.ddpParentConnection = DDP.connect(mirrorInfo.parentUrl)
            env.execute()
          }, 0)
        } else {
          if (mirrorInfo.mirrorUrl) {
            var iframe = document.createElement('iframe')
            iframe.src = mirrorInfo.mirrorUrl
            // Make the iFrame invisible
            iframe.style.width = 0
            iframe.style.height = 0
            iframe.style.border = 0
            document.body.appendChild(iframe)
          } else {
            logInfo('The client tests will only run when you reload ' +
                    'the app after the mirror app has started.')
          }
        }
      })
    })
  },

  _reportResults: function () {
    Meteor.call('completed', {framework: this.name})
  }
})
