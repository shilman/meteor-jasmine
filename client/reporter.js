/* global
   VelocityTestReporter: true
 */

var noopTimer = {
  start: function() {},
  elapsed: function() { return 0; }
};

VelocityTestReporter = function VelocityTestReporter(options) {
  var timer = options.timer || noopTimer;
  var ancestors = [];

  this.jasmineStarted = function() {
    timer.start();
  };

  this.jasmineDone = function() {
    Meteor.call('jasmineMarkClientTestsCompleted');
  };

  this.suiteStarted = function(result) {
    ancestors.unshift(result.description);
  };

  this.suiteDone = function() {
    ancestors.shift();
  };

  this.specDone = function(result) {
    saveTestResult(result);
  };

  function saveTestResult(test) {
    var result = {
      id: 'jasmine:' + test.id,
      //async: test.async,
      framework: 'jasmine',
      name: test.fullName,
      pending: test.status === 'pending',
      result: test.status,
      time: timer.elapsed(),
      //timeOut: test._timeout,
      //timedOut: test.timedOut,
      ancestors: ancestors,
      timestamp: new Date().toTimeString()
    };
    if (test.failedExpectations[0]){
      result.failureMessage = test.failedExpectations[0].message;
      result.failureStackTrace = test.failedExpectations[0].stack;
    }

    window.ddpParentConnection.call('postResult', result, function(error){
      if (error){
        console.error('ERROR WRITING TEST', error);
      }
    });
  }
};
