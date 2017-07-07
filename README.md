# periodicjs.ext.admin [![Coverage Status](https://coveralls.io/repos/github/githubUserOrgName/periodicjs.ext.admin/badge.svg?branch=master)](https://coveralls.io/github/githubUserOrgName/periodicjs.ext.admin?branch=master) [![Build Status](https://travis-ci.org/githubUserOrgName/periodicjs.ext.admin.svg?branch=master)](https://travis-ci.org/githubUserOrgName/periodicjs.ext.admin)

  A simple extension.

  [API Documentation](https://github.com/githubUserOrgName/periodicjs.ext.admin/blob/master/doc/api.md)

  ## Usage

  ### CLI TASK

  You can preform a task via CLI
  ```
  $ cd path/to/application/root
  ### Using the CLI
  $ periodicjs ext periodicjs.ext.admin hello  
  ### Calling Manually
  $ node index.js --cli --command --ext --name=periodicjs.ext.admin --task=hello 
  ```

  ## Configuration

  You can configure periodicjs.ext.admin

  ### Default Configuration
  ```javascript
  {
    settings: {
      defaults: true,
    },
    databases: {
    },
  };
  ```


  ## Installation

  ### Installing the Extension

  Install like any other extension, run `npm run install periodicjs.ext.admin` from your periodic application root directory and then run `periodicjs addExtension periodicjs.ext.admin`.
  ```
  $ cd path/to/application/root
  $ npm run install periodicjs.ext.admin
  $ periodicjs addExtension periodicjs.ext.admin
  ```
  ### Uninstalling the Extension

  Run `npm run uninstall periodicjs.ext.admin` from your periodic application root directory and then run `periodicjs removeExtension periodicjs.ext.admin`.
  ```
  $ cd path/to/application/root
  $ npm run uninstall periodicjs.ext.admin
  $ periodicjs removeExtension periodicjs.ext.admin
  ```


  ## Testing
  *Make sure you have grunt installed*
  ```
  $ npm install -g grunt-cli
  ```

  Then run grunt test or npm test
  ```
  $ grunt test && grunt coveralls #or locally $ npm test
  ```
  For generating documentation
  ```
  $ grunt doc
  $ jsdoc2md commands/**/*.js config/**/*.js controllers/**/*.js  transforms/**/*.js utilities/**/*.js index.js > doc/api.md
  ```
  ## Notes
  * Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation