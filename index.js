'use strict';
var path = require('path');

/**
 * An Admin interface extension for authoring content.
 * @{@link https://github.com/typesettin/periodicjs.ext.admin}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.admin
 * @requires module:path
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function (periodic) {
	// express,app,logger,config,db,mongoose
	var adminRouter = periodic.express.Router(),
		itemRouter = periodic.express.Router(),
		tagRouter = periodic.express.Router(),
		tagAdminRouter = periodic.express.Router(),
		mediaRouter = periodic.express.Router(),
		mediaAdminRouter = periodic.express.Router(),
		userAdminRouter = periodic.express.Router(),
		contenttypeRouter = periodic.express.Router(),
		contenttypeAdminRouter = periodic.express.Router(),
		categoryRouter = periodic.express.Router(),
		categoryAdminRouter = periodic.express.Router(),
		collectionRouter = periodic.express.Router(),
		libraryRouter = periodic.express.Router(),
		settingsRouter = periodic.express.Router(),
		extensionAdminRouter = periodic.express.Router(),
		themeAdminRouter = periodic.express.Router(),
		periodicRouter = periodic.express.Router(),
		themeController = require(path.resolve(process.cwd(), './app/controller/theme'))(periodic),
		extController = require(path.resolve(process.cwd(), './app/controller/extension'))(periodic),
		itemController = require(path.resolve(process.cwd(), './app/controller/item'))(periodic),
		tagController = require(path.resolve(process.cwd(), './app/controller/tag'))(periodic),
		mediaassetController = require(path.resolve(process.cwd(), './app/controller/asset'))(periodic),
		categoryController = require(path.resolve(process.cwd(), './app/controller/category'))(periodic),
		userController = require(path.resolve(process.cwd(), './app/controller/user'))(periodic),
		contenttypeController = require(path.resolve(process.cwd(), './app/controller/contenttype'))(periodic),
		collectionController = require(path.resolve(process.cwd(), './app/controller/collection'))(periodic),
		libraryController = require(path.resolve(process.cwd(), './app/controller/library'))(periodic),
		adminController = require('./controller/admin')(periodic),
		adminSettingsController = require('./controller/settings')(periodic),
		authController = require('../periodicjs.ext.login/controller/auth')(periodic),
		uacController = require('../periodicjs.ext.user_access_control/controller/uac')(periodic);
	/**
	 * access control routes
	 */
	adminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	extensionAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	themeAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	itemRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	collectionRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	libraryRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	mediaRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	userAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	settingsRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);

	/**
	 * admin routes
	 */
	// adminRouter.get('/', adminController.settings_index);
	adminRouter.get('/', adminController.getMarkdownReleases, adminController.getHomepageStats, adminController.index);
	adminRouter.get('/items', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, adminController.items_index);
	adminRouter.get('/collections', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, adminController.collections_index);
	adminRouter.get('/libraries', libraryController.loadLibrariesWithCount, libraryController.loadLibrariesWithDefaultLimit, libraryController.loadLibraries, adminController.libraries_index);
	adminRouter.get('/contenttypes', contenttypeController.loadContenttypeWithCount, contenttypeController.loadContenttypeWithDefaultLimit, contenttypeController.loadContenttypes, adminController.contenttypes_index);
	adminRouter.get('/tags', tagController.loadTagsWithCount, tagController.loadTagsWithDefaultLimit, tagController.loadTags, adminController.tags_index);
	adminRouter.get('/categories', categoryController.loadCategoriesWithCount, categoryController.loadCategoriesWithDefaultLimit, categoryController.loadCategories, adminController.categories_index);
	adminRouter.get('/assets', mediaassetController.loadAssetWithCount, mediaassetController.loadAssetWithDefaultLimit, mediaassetController.loadAssets, adminController.assets_index);
	adminRouter.get('/extensions', adminController.loadExtensions, adminController.extensions_index);
	adminRouter.get('/themes', adminController.loadThemes, adminController.themes_index);
	adminRouter.get('/users', userController.loadUsersWithCount, userController.loadUsersWithDefaultLimit, uacController.loadUacUsers, adminController.users_index);
	adminRouter.get('/mailer', adminController.mail_index);
	adminRouter.get('/check_periodic_version', adminController.check_periodic_version);
	/**
	 * admin/extension manager routes
	 */
	extensionAdminRouter.get('/install', extController.install);
	extensionAdminRouter.get('/install/log/:extension/:date', extController.install_getOutputLog);
	extensionAdminRouter.get('/upload/log/:extension/:date', extController.upload_getOutputLog);
	extensionAdminRouter.get('/remove/log/:extension/:date', extController.remove_getOutputLog);
	extensionAdminRouter.get('/cleanup/log/:extension/:date', extController.cleanup_log);
	extensionAdminRouter.get('/:id/disable', adminController.loadExtensions, adminController.loadExtension, extController.disable);
	extensionAdminRouter.get('/:id/enable', adminController.loadExtensions, adminController.loadExtension, extController.enable);
	extensionAdminRouter.post('/upload', mediaassetController.upload, extController.upload_install);
	extensionAdminRouter.post('/:id/delete', adminController.loadExtension, extController.remove);
	extensionAdminRouter.get('/:id', adminController.loadExtension, adminSettingsController.load_extension_settings, adminController.extension_show);
	/**
	 * admin/theme manager routes
	 */
	themeAdminRouter.get('/install', themeController.install);
	themeAdminRouter.get('/install/log/:theme/:date', themeController.install_getOutputLog);
	themeAdminRouter.get('/upload/log/:theme/:date', themeController.upload_getOutputLog);
	themeAdminRouter.get('/remove/log/:theme/:date', themeController.remove_getOutputLog);
	themeAdminRouter.get('/cleanup/log/:theme/:date', themeController.cleanup_log);
	themeAdminRouter.get('/:id/enable', themeController.enable);
	themeAdminRouter.post('/upload', mediaassetController.upload, themeController.upload_install);
	themeAdminRouter.post('/:id/delete', themeController.remove);
	themeAdminRouter.get('/:id', adminController.loadTheme, adminController.theme_show);
	/**
	 * admin/item manager routes
	 */
	adminRouter.get('/item/new', adminController.item_new);
	adminRouter.get('/item/edit/:id', itemController.loadFullItem, adminController.item_edit);
	adminRouter.get('/item/search', adminController.setSearchLimitTo1000, itemController.loadItems, itemController.index);
	itemRouter.post('/new', itemController.create);
	itemRouter.post('/edit', itemController.update);
	itemRouter.post('/:id/delete', itemController.loadItem, itemController.remove);
	/**
	 * admin/collection manager routes
	 */
	adminRouter.get('/collection/new', adminController.collection_new);
	adminRouter.get('/collection/edit/:id', collectionController.loadCollection, adminController.collection_edit);
	adminRouter.get('/collection/search', adminController.setSearchLimitTo1000, collectionController.loadCollections, collectionController.index);
	collectionRouter.post('/new', collectionController.create);
	collectionRouter.post('/edit', collectionController.update);
	collectionRouter.post('/append/:id', collectionController.loadCollection, collectionController.append);
	collectionRouter.post('/:id/delete', collectionController.loadCollection, collectionController.remove);
	/**
	 * admin/library manager routes
	 */
	adminRouter.get('/library/new', adminController.library_new);
	adminRouter.get('/library/edit/:id', libraryController.loadLibrary, adminController.library_edit);
	adminRouter.get('/library/search', adminController.setSearchLimitTo1000, libraryController.loadLibraries, libraryController.index);
	adminRouter.get('/library/search_content', adminController.setSearchLimitTo1000, itemController.loadItems, collectionController.loadCollections, adminController.library_content_search_index);
	libraryRouter.post('/new', libraryController.create);
	libraryRouter.post('/edit', libraryController.update);
	libraryRouter.post('/append/:id', libraryController.loadLibrary, libraryController.append);
	libraryRouter.post('/:id/delete', libraryController.loadLibrary, libraryController.remove);

	/**
	 * admin/tag manager routes
	 */
	tagRouter.post('/new/:id', tagController.loadTag, tagController.create);
	tagRouter.post('/new', tagController.loadTag, tagController.create);
	tagRouter.post('/:id/delete', tagController.loadTag, tagController.remove);
	tagRouter.post('/edit', tagController.update);
	tagAdminRouter.get('/edit/:id', tagController.loadTag, adminController.tag_show);
	tagAdminRouter.get('/:id', tagController.loadTag, adminController.tag_show);
	tagAdminRouter.get('/:id/parent', tagController.loadTag, adminController.tag_parent);
	/**
	 * admin/category manager routes
	 */
	categoryRouter.post('/new/:id', categoryController.loadCategory, categoryController.create);
	categoryRouter.post('/new', categoryController.loadCategory, categoryController.create);
	categoryRouter.post('/:id/delete', categoryController.loadCategory, categoryController.remove);
	categoryRouter.post('/edit', categoryController.update);
	categoryAdminRouter.get('/edit/:id', categoryController.loadCategory, adminController.category_show);
	categoryAdminRouter.get('/:id', categoryController.loadCategory, adminController.category_show);
	categoryAdminRouter.get('/:id/parent', categoryController.loadCategory, adminController.category_parent);
	/**
	 * admin/categorytype manager routes
	 */
	contenttypeRouter.post('/new/:id', contenttypeController.loadContenttype, contenttypeController.create);
	contenttypeRouter.post('/new', contenttypeController.loadContenttype, contenttypeController.create);
	contenttypeRouter.post('/:id/delete', contenttypeController.loadContenttype, contenttypeController.remove);
	contenttypeRouter.post('/append/:id', contenttypeController.loadContenttype, contenttypeController.append);
	contenttypeRouter.post('/removeitem/:id', contenttypeController.loadContenttype, contenttypeController.removeitem);
	contenttypeAdminRouter.get('/edit/:id', contenttypeController.loadContenttype, adminController.contenttype_show);
	contenttypeAdminRouter.get('/:id', contenttypeController.loadContenttype, adminController.contenttype_show);
	/**
	 * admin/media manager routes
	 */
	mediaRouter.post('/new', mediaassetController.upload, mediaassetController.createassetfile);
	mediaRouter.post('/:id/delete', mediaassetController.loadAsset, mediaassetController.remove);
	mediaRouter.post('/edit', mediaassetController.update);
	mediaAdminRouter.get('/edit/:id', mediaassetController.loadAsset, adminController.asset_show);
	mediaAdminRouter.get('/:id', mediaassetController.loadAsset, adminController.asset_show);

	/**
	 * admin/user routes
	 */
	userAdminRouter.get('/new', adminController.users_new);
	userAdminRouter.get('/:id', userController.loadUser, adminController.users_show);
	userAdminRouter.get('/:id/edit', userController.loadUser, adminController.users_edit);
	userAdminRouter.post('/edit', userController.update);
	userAdminRouter.post('/new', userController.create);
	userAdminRouter.post('/:id/delete', userController.loadUser, userController.remove);


	/**
	 * admin/settings routes
	 */
	settingsRouter.get('/', adminSettingsController.load_app_settings, adminSettingsController.load_theme_settings, adminController.settings_index);
	settingsRouter.get('/faq', adminController.settings_faq);
	settingsRouter.post('/restart', adminSettingsController.restart_app);
	settingsRouter.post('/updateapp', adminSettingsController.update_app);
	settingsRouter.post('/updateappsettings', adminSettingsController.update_app_settings);
	settingsRouter.post('/updatethemesettings', adminSettingsController.update_theme_settings);

	settingsRouter.post('/updateextfiledata', adminSettingsController.update_ext_filedata);
	settingsRouter.post('/themefiledata', adminSettingsController.update_theme_filedata);

	/**
	 * periodic routes
	 */
	periodicRouter.get('/user/search.:ext', userController.loadUsers, userController.searchResults);
	periodicRouter.get('/user/search', userController.loadUsers, userController.searchResults);
	periodicRouter.get('/category/search.:ext', categoryController.loadCategories, categoryController.searchResults);
	periodicRouter.get('/category/search', categoryController.loadCategories, categoryController.searchResults);
	periodicRouter.get('/category/:id/children', categoryController.loadCategory, categoryController.loadChildren, categoryController.showChildren);
	periodicRouter.get('/contenttype/search.:ext', contenttypeController.loadContenttypes, contenttypeController.searchResults);
	periodicRouter.get('/contenttype/search', contenttypeController.loadContenttypes, contenttypeController.searchResults);
	periodicRouter.get('/tag/search.:ext', tagController.loadTags, tagController.searchResults);
	periodicRouter.get('/tag/search', tagController.loadTags, tagController.searchResults);
	periodicRouter.get('/tag/:id/children', tagController.loadTag, tagController.loadChildren, tagController.showChildren);

	adminRouter.use('/asset', mediaAdminRouter);
	adminRouter.use('/extension', extensionAdminRouter);
	adminRouter.use('/theme', themeAdminRouter);
	adminRouter.use('/contenttype', contenttypeAdminRouter);
	adminRouter.use('/tag', tagAdminRouter);
	adminRouter.use('/category', categoryAdminRouter);
	adminRouter.use('/user', userAdminRouter);
	adminRouter.use('/settings', settingsRouter);
	periodic.app.use('/p-admin', adminRouter);
	periodic.app.use('/item', itemRouter);
	periodic.app.use('/collection', collectionRouter);
	periodic.app.use('/library', libraryRouter);
	periodic.app.use('/tag', tagRouter);
	periodic.app.use('/category', categoryRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/mediaasset', mediaRouter);
	periodic.app.use(periodicRouter);
};
