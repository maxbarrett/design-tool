# A (mostly) working version of Tom Dale's Ember screencast

##Why only (mostly) working?
I ran into issues when starting to use the Rails API on port 3000. I used `python -m SimpleHTTPServer` in the root of the project and received this error an `Access-Control-Allow-Origin` error in Chrome. As a result, there are 2 branches: master and fixtures. The master branch is all of the code of the tutorial while the fixtures branch does everything up to moving away from fixtures and using a server.

**See [Issue 1](https://github.com/cmoel/tom_dale_ember_screencast/issues/1) for a fix for the `Access-Control-Allow-Origin` error when using rails as the backend.**

##What was needed to get it working?
The Ember Starter Kit does not include the latest version of Ember. I built [Ember](https://github.com/emberjs/ember.js/) and [Ember Data](https://github.com/emberjs/data) from source and included that instead of the version of Ember used in the Starter Kit. The downloads for Ember Data are also out of date, which is why I needed to build from source.

##Any ideas how to fix the `Access-Control-Allow-Origin` problem?
Submit a pull request and we'll get it fixed.
