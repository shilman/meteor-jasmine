# jasmine

Run Jasmine tests in the browser. Only supports client tests that run in the browser with the app context for now.
You can use all [Jasmine 2.0 features](http://jasmine.github.io/2.0/introduction.html) and the same syntax for your tests.

Place your tests in the folder `tests/jasmine/client/`. You can nest them inside this folder how you want.

Open the mirror app `http://localhost:5000`. The mirror app will run the tests.
Your normal running app is not affected my the package.

### Installation

```
mrt add velocity jasmine velocity-html-reporter
```

### Example

Check out [my example](https://github.com/Sanjo/velocity-example/tree/jasmine-example) of testing
a improved version of the leaderboard example with unit and integration tests written with Jasmine.

### Mocks

This package ships with mocks for the Meteor API.
An example for using them can be found [here](https://github.com/Sanjo/velocity-example/blob/jasmine-example/tests/jasmine/client/unit/LeaderboardSpec.js).

You can also create your own mocks. I would suggest to use the following pattern:

Create a mock service with a method `install` and `uninstall` ([example for Meteor](https://github.com/alanning/meteor-stubs/blob/master/index.js))

  * install: Saves the original object and mocks it
  * uninstall: Restores the original object
  
This pattern allows you to enable mocks only for specific tests and have a clean and independent mock for each test.

### Roadmap

* Support server tests that run inside the Meteor context.
