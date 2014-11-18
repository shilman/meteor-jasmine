### Info for sanjo:jasmine maintainers

#### Testing

We use spacejamio:munit with the BDD style for testing sanjo:jasmine.

##### Running package unit tests

```bash
cd test-app
meteor test-packages sanjo:jasmine
```

#### Publish a new version

1. Increase the version in `package.js` (follow [Semantic Versioning conventions](http://semver.org/))
2. `meteor publish`
3. Commit "Bumps version to X.X.X"
4. Create a tag with the version "X.X.X"
5. Push
