var context = (typeof window !== 'undefined') ? window : global;
var mocker = (typeof window !== 'undefined') ? window.mocker : global.ComponentMocker;
var originals = [];

var mock = function (object, propertyName) {
  if (typeof object !== 'object' && typeof object !== 'function') {
    throw new Error('object must be an object');
  }
  if (typeof propertyName !== 'string') {
    throw new Error('propertyName must be a string');
  }
  if (typeof object[propertyName] === 'undefined') {
    throw new Error('property does not exist on object');
  }

  originals.push({
    object: object,
    propertyName: propertyName,
    value: object[propertyName]
  });
  var metadata = mocker.getMetadata(object[propertyName]);
  var mock = mocker.generateFromMetadata(metadata);
  object[propertyName] = mock;
  return mock;
};

context.mock = mock;

function restoreOriginal(original) {
  original.object[original.propertyName] = original.value;
}

function restoreOriginals() {
  originals.forEach(restoreOriginal);
  originals = [];
}

afterEach(restoreOriginals);
