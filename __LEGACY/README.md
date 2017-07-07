# periodicjs.ext.admin

An Admin interface extension for authoring content.

 [API Documentation](https://github.com/typesettin/periodicjs.ext.admin/blob/master/doc/api.md)

## Installation

```
$ npm install periodicjs.ext.admin
```

## Configure

after the extension has been installed, the extension configuration is located in `content/config/extensions/periodicjs.ext.admin/settings.json`

##Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```
For generating documentation
```
$ grunt doc
$ jsdoc2md controller/**/*.js index.js install.js uninstall.js > doc/api.md
```
##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation