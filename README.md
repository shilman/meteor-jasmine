# jasmine

Easily run Jasmine browser and server tests.
Supports client tests that run in the browser with the app context
and unit tests that run in a mocked server environment.
You can use all [Jasmine 2.0 features](http://jasmine.github.io/2.0/introduction.html)
and the same syntax for your tests.

Place your client integration tests in the folder `tests/jasmine/client/integration/`.
Place your server unit tests in the folder `tests/jasmine/server/unit/`
You can nest them inside this folder how you want.

__Important:__ Open `http://localhost:5000` in your browser. It will run the client tests.

### Installation

#### Since Meteor 0.9

```bash
meteor add sanjo:jasmine
meteor add velocity:html-reporter
```

#### Before Meteor 0.9

```bash
mrt add velocity
mrt add jasmine
mrt add velocity-html-reporter
```

### Example

Check out the Jasmine tests in the [velocity-example](https://github.com/meteor-velocity/velocity-example/tree/jasmine-only/tests/jasmine/).

### Mocks

#### Mocking Meteor

This package ships with mocks for the Meteor API. You can mock the Meteor API in your tests with:

```javascript
beforeEach(function () {
  MeteorStubs.install();
});

afterEach(function () {
  MeteorStubs.uninstall();
});
```

This is done automatically for server unit tests.
You need to do it yourself for your client tests if you want to write
unit tests that run in the browser.

#### Mocking objects

You can mock any object with the global helper function `mock`.
This will avoid unwanted side effects that can affect other tests.
Here is an example how to mock the Players collection of the Leaderboard example:

```javascript
beforeEach(function () {
  mock(window, 'Players');
});
```

This will mock the Players collection for each test.
The original Players collection is automatically restored after each test.

#### Creating more complex mocks

You can also create mocks manually. I would suggest to use the following pattern:

Create a mock service with a method `install` and `uninstall` ([example for Meteor](https://github.com/alanning/meteor-stubs/blob/master/index.js))

  * install: Saves the original object and mocks it
  * uninstall: Restores the original object
  
This pattern allows you to enable mocks only for specific tests and have a clean and independent mock for each test.

### Copyright

The code is licensed under the MIT License (see LICENSE file). 

The boot.js scripts are based on code that is part of Jasmine 2.0 ([LICENSE](https://github.com/pivotal/jasmine/blob/v2.0.0/MIT.LICENSE)).
