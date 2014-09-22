/* global
 Velocity: false
 */

if (Meteor.isServer) {

  var util = Npm.require('util'),
    jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js'),
    consoleFns = Npm.require('jasmine-core/lib/console/console.js');

  _.extend(jasmineRequire, consoleFns);

  var jasmine = jasmineRequire.core(jasmineRequire)
  jasmineRequire.console(jasmineRequire, jasmine);

  var consoleClientReporter;

  Meteor.methods({
    "jasmineStartedConsumer": function () {
      consoleClientReporter = new jasmine.ConsoleReporter({
        name: "Client Integration Tests",
        print: util.print,
        showColors: true,
        cutStack: "/client/jasmine/integration",
        timer: new jasmine.Timer()
      })
      consoleClientReporter.jasmineStarted();
    },
    "jasmineDoneConsumer": function () {
      consoleClientReporter.jasmineDone();
    },
    "specDoneConsumer": function (result) {
      consoleClientReporter.specDone(result);
    }
  })
}

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
      },
      convertTestPathToMirrorPath: function (filePath) {
        return filePath.replace('jasmine/client', 'client/jasmine');
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
    var env = this.jasmine.getEnv()

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

    var serverReporter = {
      jasmineStarted: function() {
        window.ddpParentConnection.call("jasmineStartedConsumer");
      },
      jasmineDone: function () {
        window.ddpParentConnection.call("jasmineDoneConsumer")
      },
      specDone: function (result) {
        window.ddpParentConnection.call("specDoneConsumer", result)
      }
    }

    env.addReporter(serverReporter);

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
      Meteor.call('jasmineIsMirror', function(error, mirrorInfo) {
        if (error) {
          throw error
        } else if (mirrorInfo.isMirror) {
          Meteor.setTimeout(function(){
            logInfo('Running Jasmine tests')
            window.ddpParentConnection = DDP.connect(mirrorInfo.parentUrl)
            env.execute()
          }, 0)
        } else {
          var insertMirrorIframe = function (mirrorUrl) {
            var iframe = document.createElement('iframe')
            iframe.src = mirrorUrl
            // Make the iFrame invisible
            iframe.style.width = 0
            iframe.style.height = 0
            iframe.style.border = 0
            document.body.appendChild(iframe)
          }

          var hasMirrorStartedCheckCallback = function (error, mirrorInfo) {
            if (error) {
              throw error
            } else {
              if (mirrorInfo) {
                insertMirrorIframe(mirrorInfo.rootUrl)
              } else {
                startHasMirrorStartedTimeout()
              }
            }
          }

          var hasMirrorStartedCheck = function () {
            Meteor.call('jasmineMirrorInfo', hasMirrorStartedCheckCallback)
          }

          var startHasMirrorStartedTimeout = function () {
            return Meteor.setTimeout(hasMirrorStartedCheck, 1000)
          }

          startHasMirrorStartedTimeout()
        }
      })
    })
  },

  _reportResults: function () {
    Meteor.call('completed', {framework: this.name})
  }
})
