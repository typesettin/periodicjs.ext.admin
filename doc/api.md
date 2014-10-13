#Index

**Modules**

* [periodicjs.ext.admin](#periodicjs.ext.module_admin)
* [adminController](#module_adminController)
* [settingsController](#module_settingsController)

**Functions**

* [users_edit(req, res)](#users_edit)
* [sendEmail(options, callbackk)](#sendEmail)
* [sendSettingEmail(options, callbackk)](#sendSettingEmail)
* [restart_app(req, res)](#restart_app)
* [update_app(req, res)](#update_app)
* [load_extension_settings(req, res, next)](#load_extension_settings)
  * [load_extension_settings~getextensionconfigfiles(callback)](#load_extension_settings..getextensionconfigfiles)
  * [load_extension_settings~copymissingconfigfiles(missingExtConfFiles, callback)](#load_extension_settings..copymissingconfigfiles)
  * [load_extension_settings~loadconfigfiles(callback)](#load_extension_settings..loadconfigfiles)
* [update_ext_filedata(req, res)](#update_ext_filedata)
 
<a name="periodicjs.ext.module_admin"></a>
#periodicjs.ext.admin
An Admin interface extension for authoring content.

**Params**

- periodic `object` - variable injection of resources from current periodic instance  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="module_adminController"></a>
#adminController
admin controller

**Params**

- resources `object` - variable injection from current periodic instance with references to the active logger and mongo session  

**Returns**: `object` - admin  
**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="module_settingsController"></a>
#settingsController
settings controller

**Params**

- resources `object` - variable injection from current periodic instance with references to the active logger and mongo session  

**Returns**: `object` - settings  
**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="users_edit"></a>
#users_edit(req, res)
make sure a user is authenticated, if not logged in, send them to login page and return them to original resource after login

**Params**

- req `object`  
- res `object`  

**Returns**: `function` - next() callback  
<a name="sendEmail"></a>
#sendEmail(options, callbackk)
default email settings, sends mail with nodemailer and mail core extension

**Params**

- options `object` - contains email options and nodemailer transport  
- callbackk `function` - async callback  

<a name="sendSettingEmail"></a>
#sendSettingEmail(options, callbackk)
send setting update email

**Params**

- options `object` - contains email options and nodemailer transport  
- callbackk `function` - async callback  

<a name="restart_app"></a>
#restart_app(req, res)
restarts application response handler and send notification email

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="update_app"></a>
#update_app(req, res)
placeholder response for updating application

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="load_extension_settings"></a>
#load_extension_settings(req, res, next)
load the extensions configuration files from the installed config folder in content/config/extensions/[extension]/[config files]

**Params**

- req `object`  
- res `object`  
- next `function`  

<a name="update_ext_filedata"></a>
#update_ext_filedata(req, res)
save data from config page post

**Params**

- req `object`  
- res `object`  

