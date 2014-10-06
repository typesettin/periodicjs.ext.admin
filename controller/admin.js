'use strict';

var path = require('path'),
    async = require('async'),
    request = require('superagent'),
    semver = require('semver'),
    fs = require('fs-extra'),
    moment = require('moment'),
    Utilities = require('periodicjs.core.utilities'),
    ControllerHelper = require('periodicjs.core.controllerhelper'),
    Extensions = require('periodicjs.core.extensions'),
    ExtensionCore = new Extensions({
        extensionFilePath: path.resolve(process.cwd(),'./content/extensions/extensions.json' 
    )}),
    CoreUtilities,
    CoreController,
    appSettings,
    dbSettings,
    mongoose,
    User,
    Collection,
    Item,//Item
    AppDBSetting,
    Contenttype,
    logger;

var loadDefaultContentTypes = function(contentypes,callback){
    var query = {
        _id: {
            $in:contentypes
        }
    };

    CoreController.searchModel({
        model: Contenttype,
        query: query,
        callback: callback
    });
};
var getDefaultContentTypes = function(contentypesetting,callback){
    CoreController.loadModel({
        docid: contentypesetting,
        model: AppDBSetting,
        callback:function(err,defaultcontenttypes){
            if(err){
                callback(err,null);
            }
            else if(defaultcontenttypes && defaultcontenttypes.value){
                loadDefaultContentTypes(defaultcontenttypes.value,callback);
            }
            else{
                callback(null,null);
            }
        }
    });
};

var index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                err:err,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'admin',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    items: null,
                    user:req.user
                }
            });
        }
    );
};

var settings_index = function(req,res){
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/settings/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            // console.log('req.controllerData.themesettings',req.controllerData.themesettings);
            // console.log('req.controllerData.appsettings',req.controllerData.appsettings);
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Application Settings',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/settings.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    user:req.user,
                    themesettings:req.controllerData.themesettings,
                    appsettings:req.controllerData.appsettings,
                }
            });
        }
    );
};

var settings_faq = function(req,res){
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/settings/faq',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Application Quick Help',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/settings.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    user:req.user
                }
            });
        }
    );
};

var mail_index = function(req,res){
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/mailer/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Mail Settings',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/mailer.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    user:req.user
                }
            });
        }
    );
};

var items_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/items/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                err:err,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'item admin',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    items: req.controllerData.items,
                    itemscount: req.controllerData.itemscount,
                    itempages: Math.ceil(req.controllerData.itemscount/req.query.limit),
                    // privileges: req.controllerData.privileges,
                    user:req.user
                }
            });
        }
    );
};

var item_new = function(req, res) {

    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/items/new',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            if(!err && !User.hasPrivilege(req.user,110)){
                err = new Error('You don\'t have access to view content');
            }
            getDefaultContentTypes('item_default_contenttypes',function(err,defaultcontenttypes){
                if(err){
                    CoreController.handleDocumentQueryErrorResponse({
                        err:err,
                        res:res,
                        req:req
                    });
                }
                else{
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:'New Item',
                                headerjs: ['/extensions/periodicjs.ext.admin/js/item.min.js'],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            item:null,
                            default_contentypes:defaultcontenttypes,
                            serverdate:moment().format('YYYY-MM-DD'),
                            servertime:moment().format('HH:mm'),
                            user:req.user
                        }
                    });
                }
            });            
        }
    );
};

var item_edit = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/items/edit',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            getDefaultContentTypes('item_default_contenttypes',function(err,defaultcontenttypes){
                if(err){
                    CoreController.handleDocumentQueryErrorResponse({
                        err:err,
                        res:res,
                        req:req
                    });
                }
                else{
                    if(defaultcontenttypes && defaultcontenttypes.length >0){
                        if(req.controllerData.item.contenttypes && req.controllerData.item.contenttypes.length>0){
                            for(var a in defaultcontenttypes){
                                var alreadyHasContenttype = false;
                                for(var b in  req.controllerData.item.contenttypes){
                                    if( defaultcontenttypes[a]._id.equals(req.controllerData.item.contenttypes[b]._id)){
                                        alreadyHasContenttype = true;
                                    }
                                    // console.log('a',a,'defaultcontenttypes[a]._id',defaultcontenttypes[a]._id,'b',b,req.controllerData.item.contenttypes[b]._id,'alreadyHasContenttype',alreadyHasContenttype);
                                }
                                if(alreadyHasContenttype===false){
                                    req.controllerData.item.contenttypes.push(defaultcontenttypes[a]);
                                }
                            }
                        }
                        else{
                            req.controllerData.item.contenttypes = defaultcontenttypes;                        
                        }
                    }
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:req.controllerData.item.title+' - Edit Item',
                                headerjs: ['/extensions/periodicjs.ext.admin/js/item.min.js'],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            item: req.controllerData.item,
                            serverdate:moment(req.controllerData.item.publishat).format('YYYY-MM-DD'),
                            servertime:moment(req.controllerData.item.publishat).format('HH:mm'),
                            user:req.user
                        }
                    });
                }
            });
            
        }
    );
};

var collections_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/collections/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Collections',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    collections: req.controllerData.collections,
                    collectionscount: req.controllerData.collectionscount,
                    collectionpages: Math.ceil(req.controllerData.collectionscount/req.query.limit),
                    user:req.user
                }
            });
        }
    );
};

var collection_new = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/collections/new',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            getDefaultContentTypes('collection_default_contenttypes',function(err,defaultcontenttypes){
                if(err){
                    CoreController.handleDocumentQueryErrorResponse({
                        err:err,
                        res:res,
                        req:req
                    });
                }
                else{
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:'New Collection',
                                headerjs: ['/extensions/periodicjs.ext.admin/js/collection.min.js'],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            collection:null,
                            default_contentypes:defaultcontenttypes,
                            serverdate:moment().format('YYYY-MM-DD'),
                            servertime:moment().format('HH:mm'),
                            user:req.user
                        }
                    });
                }
            });
        }
    );
};

var collection_edit = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/collections/edit',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            

            getDefaultContentTypes('collection_default_contenttypes',function(err,defaultcontenttypes){
                if(err){
                    CoreController.handleDocumentQueryErrorResponse({
                        err:err,
                        res:res,
                        req:req
                    });
                }
                else{
                    if(defaultcontenttypes && defaultcontenttypes.length >0){
                        if(req.controllerData.collection.contenttypes && req.controllerData.collection.contenttypes.length>0){
                            for(var a in defaultcontenttypes){
                                var alreadyHasContenttype = false;
                                for(var b in  req.controllerData.collection.contenttypes){
                                    if( defaultcontenttypes[a]._id.equals(req.controllerData.collection.contenttypes[b]._id)){
                                        alreadyHasContenttype = true;
                                    }
                                    // console.log('a',a,'defaultcontenttypes[a]._id',defaultcontenttypes[a]._id,'b',b,req.controllerData.collection.contenttypes[b]._id,'alreadyHasContenttype',alreadyHasContenttype);
                                }
                                if(alreadyHasContenttype===false){
                                    req.controllerData.collection.contenttypes.push(defaultcontenttypes[a]);
                                }
                            }
                        }
                        else{
                            req.controllerData.collection.contenttypes = defaultcontenttypes;                        
                        }
                    }
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:req.controllerData.collection.title+' - Edit Collection',
                                headerjs: ['/extensions/periodicjs.ext.admin/js/collection.min.js'],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            collection: req.controllerData.collection,
                            serverdate:moment(req.controllerData.collection.publishat).format('YYYY-MM-DD'),
                            servertime:moment(req.controllerData.collection.publishat).format('HH:mm'),
                            user:req.user
                        }
                    });
                }
            }); 

        }
    );
};

var assets_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/assets/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Assets',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/asset.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    assets: req.controllerData.assets,
                    assetscount: req.controllerData.assetscount,
                    assetpages: Math.ceil(req.controllerData.assetscount/req.query.limit),
                    user:req.user
                }
            });
        }
    );
};

var asset_show = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/assets/show',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.asset.title+' - Edit Assets',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/asset.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    asset: req.controllerData.asset,
                    user:req.user
                }
            });
        }
    );
};

var contenttypes_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/contenttypes/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'content type admin',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/contenttype.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    contenttypes: req.controllerData.contenttypes,
                    contenttypescount: req.controllerData.contenttypescount,
                    contenttypepages: Math.ceil(req.controllerData.contenttypescount/req.query.limit),
                    user:req.user
                }
            });
        }
    );
};

var contenttype_show = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/contenttypes/show',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.contenttype.title+' - Edit Content Types',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/contenttype.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    periodic:{
                        version: appSettings.version
                    },
                    contenttype: req.controllerData.contenttype,
                    user:req.user
                }
            });
        }
    );
};

var tags_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/tags/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'tag admin',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    tags: req.controllerData.tags,
                    tagscount: req.controllerData.tagscount,
                    tagpages: Math.ceil(req.controllerData.tagscount/req.query.limit),
                    user:req.user
                }
            });
        }
    );
};

var tag_show = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/tags/show',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.tag.title+' - Edit Tag',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    periodic:{
                        version: appSettings.version
                    },
                    tag: req.controllerData.tag,
                    user:req.user
                }
            });
        }
    );
};

var tag_parent = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/tags/show_parent',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.tag.title+' - Edit Tag',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    periodic:{
                        version: appSettings.version
                    },
                    parent: req.controllerData.tag.parent,
                    user:req.user
                }
            });
        }
    );
};

var categories_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/categories/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Category admin',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    categories: req.controllerData.categories,
                    categoriescount: req.controllerData.categoriescount,
                    categorypages: Math.ceil(req.controllerData.categoriescount/req.query.limit),
                    user:req.user
                }
            });
        }
    );
};

var category_show = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/categories/show',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.category.title+' - Edit Category',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/attributes.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    periodic:{
                        version: appSettings.version
                    },
                    category: req.controllerData.category,
                    user:req.user
                }
            });
        }
    );
};

var category_parent = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/categories/show_parent',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:req.controllerData.category.title+' - Edit Category',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    periodic:{
                        version: appSettings.version
                    },
                    parent: req.controllerData.category.parent,
                    user:req.user
                }
            });
        }
    );
};

var loadExtension = function(req, res, next){
    var extname = req.params.id,
        extFilePath = path.resolve(process.cwd(),'content/extensions/extensions.json'),
        z=false,
        selectedExt,
        currentExtensions;

    fs.readJson(extFilePath,function(err,currentExtensionsJson){
        // console.log("currentExtensionsJson",currentExtensionsJson);
        if(err){
            next(err);
        }
        else{
            currentExtensions = currentExtensionsJson.extensions;
            for (var x in currentExtensions){
                if(currentExtensions[x].name===extname){
                    z=x;
                }
            }

            if(z!==false){
                selectedExt = currentExtensions[z];
            }
            req.controllerData = (req.controllerData)?req.controllerData:{};
            req.controllerData.extension = selectedExt;
            req.controllerData.extensionx = z;
            next();
        }
    });
};

var loadExtensions = function(req, res, next){
    req.controllerData = (req.controllerData)?req.controllerData:{};

    ExtensionCore.getExtensions({
        periodicsettings:appSettings},
        function (err,extensions) {
            if(err){
                CoreController.handleDocumentQueryErrorResponse({
                    err:err,
                    res:res,
                    req:req
                });
            }
            else{
                req.controllerData.extensions = extensions;
                next();
            }
        });
};

var extensions_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/extensions/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Extensions',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/ext.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    items: false,
                    extensions: req.controllerData.extensions,
                    user:req.user
                }
            });
        }
    );
};

var extension_show = function(req, res){
    var extname = req.params.id,
        extPackageConf = ExtensionCore.getExtensionPackageJsonFilePath(extname),
        extPeriodicConf = ExtensionCore.getExtensionPeriodicConfFilePath(extname);


    // an example using an object instead of an array
    async.parallel({
        packagefile: function(callback){
            fs.readJson(extPackageConf, callback);
        },
        periodicfile: function(callback){
            fs.readJson(extPeriodicConf, callback);
        }
    },
    function(err, results) {
        if(err){
            CoreController.handleDocumentQueryErrorResponse({
                err:err,
                res:res,
                req:req
            });
        }
        else{
            CoreController.getPluginViewDefaultTemplate(
                {
                    viewname:'p-admin/extensions/show',
                    themefileext:appSettings.templatefileextension,
                    extname: 'periodicjs.ext.admin'
                },
                function(err,templatepath){
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:req.controllerData.extension.name+' - Extension',
                                // headerjs: ["/extensions/periodicjs.ext.admin/javascripts/extshow.js"],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            extdata:results,
                            extension: req.controllerData.extension,
                            user:req.user
                        }
                    });
                }
            );
        }
    });
};

var loadThemes = function(req, res, next){
    var themedir = path.resolve(process.cwd(),'content/themes/'),
    returnFiles =[];

    req.controllerData = (req.controllerData)?req.controllerData:{};

    fs.readdir(themedir,function(err,files){
        if(files){            
            for(var x =0; x< files.length; x++){
                if(files[x].match('periodicjs.theme')){
                    returnFiles.push(files[x]);
                }
            }
        }

        if(err){
            CoreController.handleDocumentQueryErrorResponse({
                err:err,
                res:res,
                req:req
            });
        }
        else{
            req.controllerData.themes = returnFiles;
            next();
        }
    });
};

var themes_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/themes/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Themes',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/theme.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    items: false,
                    themes: req.controllerData.themes,
                    activetheme: appSettings.theme,
                    user:req.user
                }
            });
        }
    );
};
var theme_show = function(req, res){
    var themename = req.params.id,
        Themes = require(path.join(process.cwd(),'app/lib/themes')),
        themeRouteConf = Themes.getThemeRouteFilePath(themename),
        themePackageConf = Themes.getThemePeriodicConfFilePath(themename);

    // an example using an object instead of an array
    async.parallel({
        packagefile: function(callback){
            fs.readJson(themePackageConf, callback);
        },
        routefile: function(callback){
            fs.readFile(themeRouteConf,'utf8', callback);
        }
    },
    function(err, results) {
        if(err){
            console.log('async callback err',themename,err);
            CoreController.handleDocumentQueryErrorResponse({
                err:err,
                res:res,
                req:req
            });
        }
        else{
            CoreController.getPluginViewDefaultTemplate(
                {
                    viewname:'p-admin/themes/show',
                    themefileext:appSettings.templatefileextension,
                    extname: 'periodicjs.ext.admin'
                },
                function(err,templatepath){
                    CoreController.handleDocumentQueryRender({
                        res:res,
                        req:req,
                        renderView:templatepath,
                        responseData:{
                            pagedata:{
                                title:req.controllerData.theme.name+' - Theme',
                                // headerjs: ["/extensions/periodicjs.ext.admin/javascripts/theme.js"],
                                extensions:CoreUtilities.getAdminMenu()
                            },
                            themedata:results,
                            theme: req.controllerData.theme,
                            user:req.user
                        }
                    });
                }
            );
        }
    });
};
var loadTheme = function(req, res, next){
    var selectedTheme = req.params.id;

    req.controllerData = req.controllerData || {};
    req.controllerData.theme = {
        name:selectedTheme,
        activetheme:appSettings.theme
    };
    if(selectedTheme){
        next();
    }
    else{
        next(new Error('no theme selected'));
    }
};

var users_index = function(req, res) {
    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/users/index',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Manage Users',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    users: req.controllerData.users,
                    user:req.user
                }
            });
        }
    );
};

var users_show = function(req, res){
    var allow_edit = false,
        params = req.params;

    if(params.id===req.user.username){
        logger.silly('users_show: logged in user matches username');
        allow_edit=true;
    }
    else if(req.user.usertype === 'admin'){
        logger.silly('users_show: user is admin');
        allow_edit=true;
    }
    else if(User.hasPrivilege(req.user,750)){
        logger.silly('users_show: has edit user privilege');
        allow_edit=true;
    }
    else{
        logger.silly('users_show: no access');
    }

    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/users/show',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title: 'User profile ('+req.controllerData.user.username+')',
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    userprofile: req.controllerData.user,
                    allow_edit:allow_edit,
                    user:req.user
                }
            });
        }
    );
};

var users_new = function(req, res){
    var allow_edit = false;

    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/users/new',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Create User Account',
                        headerjs: ['/extensions/periodicjs.ext.admin/js/userprofile.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    userprofile: null,
                    allow_edit: allow_edit,
                    user: req.user
                }
            });
        }
    );
};

var users_edit = function(req, res){
    var allow_edit = false,
        params = req.params;

    if(params.id===req.user.username){
        logger.silly('users_show: logged in user matches username');
        allow_edit=true;
    }
    else if(req.user.usertype === 'admin'){
        logger.silly('users_show: user is admin');
        allow_edit=true;
    }
    else if(User.hasPrivilege(req.user,750)){
        logger.silly('users_show: has edit user privilege');
        allow_edit=true;
    }
    else{
        logger.silly('users_show: no access');
    }

    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/users/edit',
            themefileext:appSettings.templatefileextension,
            extname: 'periodicjs.ext.admin'
        },
        function(err,templatepath){
            CoreController.handleDocumentQueryRender({
                res:res,
                req:req,
                renderView:templatepath,
                responseData:{
                    pagedata:{
                        title:'Edit '+req.controllerData.user.username,
                        headerjs: ['/extensions/periodicjs.ext.admin/js/userprofile.min.js'],
                        extensions:CoreUtilities.getAdminMenu()
                    },
                    userprofile: req.controllerData.user,
                    allow_edit:allow_edit,
                    user:req.user
                }
            });
        }
    );
};

var check_periodic_version = function(req, server_res){
    request
    .get('https://registry.npmjs.org/periodicjs')
    .set('Accept', 'application/json')
    .end(function (error, res) {
        if (res.error) {
            error = res.error;
        }
        if (error) {            
            CoreController.handleDocumentQueryErrorResponse({
                err:error,
                res:res,
                req:req
            });
        }
        else {
            var latestPeriodicVersion = res.body['dist-tags'].latest;
            var currentPeriodicVersion = appSettings.version;
            if (semver.gte(currentPeriodicVersion, latestPeriodicVersion)) {
                server_res.send({
                    status:'current',
                    message:'Your instance of Periodic ' + currentPeriodicVersion + ' is up to date with the current version ' + latestPeriodicVersion
                });
            }
            else {
                // console.log('\u0007');
                server_res.send({
                    status:'error',
                    message:'Your instance of Periodic: ' + currentPeriodicVersion + ' is out of date, Current Version: ' + latestPeriodicVersion
                });
            }
        }
    });
};

var controller = function(resources){
    logger = resources.logger;
    mongoose = resources.mongoose;
    appSettings = resources.settings;
    dbSettings = resources.db;
    CoreController = new ControllerHelper(resources);
    CoreUtilities = new Utilities(resources);
    Item = mongoose.model('Item');
    Collection = mongoose.model('Collection');
    User  = mongoose.model('User');
    AppDBSetting = mongoose.model('Setting');
    Contenttype = mongoose.model('Contenttype');

    return{
        index:index,
        settings_index:settings_index,
        settings_faq:settings_faq,
        mail_index:mail_index,
        items_index:items_index,
        item_new:item_new,
        item_edit:item_edit,
        collections_index:collections_index,
        collection_new:collection_new,
        collection_edit:collection_edit,
        extensions_index:extensions_index,
        loadExtensions:loadExtensions,
        loadExtension:loadExtension,
        extension_show:extension_show,
        themes_index:themes_index,
        loadThemes:loadThemes,
        loadTheme:loadTheme,
        theme_show:theme_show,
        contenttypes_index:contenttypes_index,
        contenttype_show:contenttype_show,
        tags_index:tags_index,
        tag_show:tag_show,
        tag_parent:tag_parent,
        categories_index:categories_index,
        category_show:category_show,
        category_parent:category_parent,
        assets_index:assets_index,
        asset_show:asset_show,
        users_index:users_index,
        users_show:users_show,
        users_edit:users_edit,
        users_new:users_new,
        check_periodic_version:check_periodic_version
    };
};

module.exports = controller;