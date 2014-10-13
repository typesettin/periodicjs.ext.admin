#Index

**Modules**

* [periodicjs.ext.admin](#periodicjs.ext.module_admin)
* [adminController](#module_adminController)
* [settingsController](#module_settingsController)

**Functions**

* [loadDefaultContentTypes(contenttypes, callbackk)](#loadDefaultContentTypes)
* [getDefaultContentTypes(contenttypesetting, callbackk)](#getDefaultContentTypes)
* [index(req, res)](#index)
* [settings_index(req, res)](#settings_index)
* [settings_faq(req, res)](#settings_faq)
* [mail_index(req, res)](#mail_index)
* [items_index(req, res)](#items_index)
* [item_new(req, res)](#item_new)
* [item_edit(req, res)](#item_edit)
* [collections_index(req, res)](#collections_index)
* [collection_new(req, res)](#collection_new)
* [collection_edit(req, res)](#collection_edit)
* [assets_index(req, res)](#assets_index)
* [asset_show(req, res)](#asset_show)
* [contenttypes_index(req, res)](#contenttypes_index)
* [contenttype_show(req, res)](#contenttype_show)
* [tags_index(req, res)](#tags_index)
* [tag_show(req, res)](#tag_show)
* [tag_parent(req, res)](#tag_parent)
* [categories_index(req, res)](#categories_index)
* [category_show(req, res)](#category_show)
* [category_parent(req, res)](#category_parent)
* [loadExtension(req, res)](#loadExtension)
* [loadExtensions(req, res)](#loadExtensions)
* [extensions_index(req, res)](#extensions_index)
* [extension_show(req, res)](#extension_show)
* [loadThemes(req, res, next)](#loadThemes)
* [themes_index(req, res)](#themes_index)
* [theme_show(req, res)](#theme_show)
* [loadTheme(req, res)](#loadTheme)
* [users_index(req, res)](#users_index)
* [users_show(req, res)](#users_show)
* [users_new(req, res)](#users_new)
* [users_edit(req, res)](#users_edit)
* [sendEmail(options, callbackk)](#sendEmail)
* [sendSettingEmail(options, callbackk)](#sendSettingEmail)
* [restart_app(req, res)](#restart_app)
* [update_app(req, res)](#update_app)
* [load_extension_settings(req, res, next)](#load_extension_settings)
  * [load_extension_settings~loadconfigfiles(callback)](#load_extension_settings..loadconfigfiles)
* [update_ext_filedata(req, res)](#update_ext_filedata)
* [load_app_settings(req, res, next)](#load_app_settings)
* [load_theme_settings(req, res, next)](#load_theme_settings)
* [update_app_settings(req, res, next)](#update_app_settings)
* [update_theme_settings(req, res, next)](#update_theme_settings)
 
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
<a name="loadDefaultContentTypes"></a>
#loadDefaultContentTypes(contenttypes, callbackk)
load contenttype data

**Params**

- contenttypes `object` - load default contentypes  
- callbackk `function` - async callback  

<a name="getDefaultContentTypes"></a>
#getDefaultContentTypes(contenttypesetting, callbackk)
get the default content type from stored db defaults

**Params**

- contenttypesetting `object` - name of default setting  
- callbackk `function` - async callback  

<a name="index"></a>
#index(req, res)
admin ext home page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="settings_index"></a>
#settings_index(req, res)
application settings and theme settings page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="settings_faq"></a>
#settings_faq(req, res)
settings faq page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="mail_index"></a>
#mail_index(req, res)
send test mail page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="items_index"></a>
#items_index(req, res)
list items page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="item_new"></a>
#item_new(req, res)
new item page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="item_edit"></a>
#item_edit(req, res)
edit item page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="collections_index"></a>
#collections_index(req, res)
list collections page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="collection_new"></a>
#collection_new(req, res)
new collection page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="collection_edit"></a>
#collection_edit(req, res)
edit collection page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="assets_index"></a>
#assets_index(req, res)
list assets page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="asset_show"></a>
#asset_show(req, res)
show asset page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="contenttypes_index"></a>
#contenttypes_index(req, res)
list content types page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="contenttype_show"></a>
#contenttype_show(req, res)
show content type page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="tags_index"></a>
#tags_index(req, res)
list tags page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="tag_show"></a>
#tag_show(req, res)
show selected tag page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="tag_parent"></a>
#tag_parent(req, res)
get tag parent page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="categories_index"></a>
#categories_index(req, res)
list categories page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="category_show"></a>
#category_show(req, res)
show category information

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="category_parent"></a>
#category_parent(req, res)
get get category parent page page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="loadExtension"></a>
#loadExtension(req, res)
get extension data from selected extension package json

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="loadExtensions"></a>
#loadExtensions(req, res)
load extensions that are enabled and installed

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="extensions_index"></a>
#extensions_index(req, res)
list installed extensions

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="extension_show"></a>
#extension_show(req, res)
show selected extension page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="loadThemes"></a>
#loadThemes(req, res, next)
loads list of installed themes by reading content/themes directory

**Params**

- req `object`  
- res `object`  
- next `object` - async callback  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="themes_index"></a>
#themes_index(req, res)
list installed themes and install new themes page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="theme_show"></a>
#theme_show(req, res)
get theme page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="loadTheme"></a>
#loadTheme(req, res)
select theme name from req parameter

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="users_index"></a>
#users_index(req, res)
shows list of users page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="users_show"></a>
#users_show(req, res)
shows user profile page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="users_new"></a>
#users_new(req, res)
create a new user page

**Params**

- req `object`  
- res `object`  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
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

<a name="load_app_settings"></a>
#load_app_settings(req, res, next)
load app configuration information

**Params**

- req `object`  
- res `object`  
- next `object` - async callback  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="load_theme_settings"></a>
#load_theme_settings(req, res, next)
load theme configuration information

**Params**

- req `object`  
- res `object`  
- next `object` - async callback  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="update_app_settings"></a>
#update_app_settings(req, res, next)
form upload handler to update app settings, and sends notification email

**Params**

- req `object`  
- res `object`  
- next `object` - async callback  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
<a name="update_theme_settings"></a>
#update_theme_settings(req, res, next)
form upload handler to update theme settings, and sends notification email

**Params**

- req `object`  
- res `object`  
- next `object` - async callback  

**Returns**: `object` - reponds with an error page or sends user to authenicated in resource  
