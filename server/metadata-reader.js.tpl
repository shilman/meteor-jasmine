// goal: read JSON metadata for packages and create the mocks
// DEPENDS ON GLOBAL OBJECT: 'ComponentMocker'

var packageMetadata = JSON.parse('{{METADATA}}')
var globalContext = (typeof global !== 'undefined') ? global : window
var originalContext = []

/*
originalContext = [
  {
    context: window,
    propertyName: 'Meteor',
    value: {}
  }
]
*/

function _saveOriginal(context, propertyName) {
  originalContext.push({
    context: context,
    propertyName: propertyName,
    value: context[propertyName]
  })
}

function _restoreOriginal(original) {
  original.context[original.propertyName] = original.value
}

function restoreOriginals() {
  originalContext.forEach(_restoreOriginal)
  originalContext = []
}

function loadMocks(targetContext) {
  var mocks = ComponentMocker.generateFromMetadata(packageMetadata);
  
  targetContext = targetContext || globalContext
  
  for (var packageName in mocks) {
    for (var packageExportName in mocks[packageName]) {
      _saveOriginal(targetContext, packageExportName)
      targetContext[packageExportName] = mocks[packageName][packageExportName]
    }
  }
}

beforeEach(loadMocks)
afterEach(restoreOriginals)
