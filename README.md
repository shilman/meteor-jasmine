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

Set your `NODE_ENV` environment variable to `development` before you start Meteor.
If `NODE_ENV` doesn't have the value `development`, the tests will not run.

### Example

Check out [my example](https://github.com/Sanjo/velocity-example/tree/jasmine-example) of testing
a improved version of the leaderboard example with unit and integration tests written with Jasmine.

### Roadmap

* Support server tests that run inside the Meteor context.
