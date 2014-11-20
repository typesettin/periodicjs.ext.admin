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
		compilationRouter = periodic.express.Router(),
		settingsAdminRouter = periodic.express.Router(),
		extensionAdminRouter = periodic.express.Router(),
		themeAdminRouter = periodic.express.Router(),
		// periodicRouter = periodic.express.Router(),
		themeController = require(path.resolve(process.cwd(), './app/controller/theme'))(periodic),
		extController = require(path.resolve(process.cwd(), './app/controller/extension'))(periodic),
		itemController = require(path.resolve(process.cwd(), './app/controller/item'))(periodic),
		tagController = require(path.resolve(process.cwd(), './app/controller/tag'))(periodic),
		mediaassetController = require(path.resolve(process.cwd(), './app/controller/asset'))(periodic),
		categoryController = require(path.resolve(process.cwd(), './app/controller/category'))(periodic),
		userController = require(path.resolve(process.cwd(), './app/controller/user'))(periodic),
		contenttypeController = require(path.resolve(process.cwd(), './app/controller/contenttype'))(periodic),
		collectionController = require(path.resolve(process.cwd(), './app/controller/collection'))(periodic),
		compilationController = require(path.resolve(process.cwd(), './app/controller/compilation'))(periodic),
		adminController = require('./controller/admin')(periodic),
		adminSettingsController = require('./controller/settings')(periodic),
		authController = require('../periodicjs.ext.login/controller/auth')(periodic),
		uacController = require('../periodicjs.ext.user_access_control/controller/uac')(periodic);
	/**
	 * access control routes
	 */
	adminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	extensionAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	themeAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	itemRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	collectionRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	compilationRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	mediaRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	userAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	settingsAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	// periodicRouter.get('*', global.CoreCache.disableCache);

	/**
	 * admin routes
	 */
	// adminRouter.get('/', adminController.settings_index);
	adminRouter.get('/', adminController.getMarkdownReleases, adminController.getHomepageStats, adminController.index);
	adminRouter.get('/items', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, adminController.items_index);
	adminRouter.get('/collections', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, adminController.collections_index);
	adminRouter.get('/compilations', compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, adminController.compilations_index);
	adminRouter.get('/contenttypes', contenttypeController.loadContenttypeWithCount, contenttypeController.loadContenttypeWithDefaultLimit, contenttypeController.loadContenttypes, adminController.contenttypes_index);
	adminRouter.get('/tags', tagController.loadTagsWithCount, tagController.loadTagsWithDefaultLimit, tagController.loadTags, adminController.tags_index);
	adminRouter.get('/categories', categoryController.loadCategoriesWithCount, categoryController.loadCategoriesWithDefaultLimit, categoryController.loadCategories, adminController.categories_index);
	adminRouter.get('/assets', mediaassetController.loadAssetWithCount, mediaassetController.loadAssetWithDefaultLimit, mediaassetController.loadAssets, adminController.assets_index);
	adminRouter.get('/extensions', adminController.loadExtensions, adminController.extensions_index);
	adminRouter.get('/themes', adminController.loadThemes, adminSettingsController.load_theme_settings, adminController.themes_index);
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
	adminRouter.get('/items/search', itemController.loadItems, adminController.items_index);
	adminRouter.get('/item/new', adminController.item_new);
	adminRouter.get('/item/edit/:id', itemController.loadFullItem, adminController.item_edit);
	adminRouter.get('/item/edit/:id/revision/:changeset', itemController.loadFullItem, adminController.item_review_revision);
	adminRouter.get('/item/edit/:id/revisions', itemController.loadFullItem, adminController.item_revisions);
	adminRouter.get('/item/search', adminController.setSearchLimitTo1000, itemController.loadItems, itemController.index);
	itemRouter.post('/new', itemController.create);
	itemRouter.post('/edit', adminController.item_loadItem, itemController.loadItem, itemController.update);
	itemRouter.post('/removechangeset/:id/:contententity/:changesetnum', itemController.loadItem, adminController.remove_changeset_from_content, itemController.update);
	itemRouter.post('/:id/delete', itemController.loadItem, itemController.remove);
	/**
	 * admin/collection manager routes
	 */
	adminRouter.get('/collections/search', collectionController.loadCollections, adminController.collections_index);
	adminRouter.get('/collection/new', adminController.collection_new);
	adminRouter.get('/collection/edit/:id', collectionController.loadCollection, adminController.collection_edit);
	adminRouter.get('/collection/edit/:id/revision/:changeset', collectionController.loadCollection, adminController.collection_review_revision);
	adminRouter.get('/collection/edit/:id/revisions', collectionController.loadCollection, adminController.collection_revisions);
	adminRouter.get('/collection/search', adminController.setSearchLimitTo1000, collectionController.loadCollections, collectionController.index);
	collectionRouter.post('/new', collectionController.create);
	collectionRouter.post('/edit', adminController.collection_loadItem, collectionController.loadCollection, collectionController.update);
	collectionRouter.post('/append/:id', collectionController.loadCollection, collectionController.append);
	collectionRouter.post('/removechangeset/:id/:contententity/:changesetnum', collectionController.loadCollection, adminController.remove_changeset_from_content, collectionController.update);
	collectionRouter.post('/:id/delete', collectionController.loadCollection, collectionController.remove);
	/**
	 * admin/compilation manager routes
	 */
	adminRouter.get('/compilation/new', adminController.compilation_new);
	adminRouter.get('/compilation/edit/:id', compilationController.loadCompilation, adminController.compilation_edit);
	adminRouter.get('/compilation/edit/:id/revision/:changeset', compilationController.loadCompilation, adminController.compilation_review_revision);
	adminRouter.get('/compilation/edit/:id/revisions', compilationController.loadCompilation, adminController.compilation_revisions);
	adminRouter.get('/compilation/search', adminController.setSearchLimitTo1000, compilationController.loadCompilations, compilationController.index);
	adminRouter.get('/compilation/search_content', adminController.setSearchLimitTo1000, itemController.loadItems, collectionController.loadCollections, adminController.compilation_content_search_index);
	compilationRouter.post('/new', compilationController.create);
	compilationRouter.post('/edit', adminController.collection_loadItem, compilationController.loadCompilation, compilationController.update);
	compilationRouter.post('/append/:id', compilationController.loadCompilation, compilationController.append);
	compilationRouter.post('/removechangeset/:id/:contententity/:changesetnum', compilationController.loadCompilation, adminController.remove_changeset_from_content, compilationController.update);
	compilationRouter.post('/:id/delete', compilationController.loadCompilation, compilationController.remove);

	/**
	 * admin/tag manager routes
	 */
	adminRouter.get('/tags/search', tagController.loadTags, adminController.tags_index);
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
	adminRouter.get('/categories/search', categoryController.loadCategories, adminController.categories_index);
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
	adminRouter.get('/contenttypes/search', contenttypeController.loadContenttypes, adminController.contenttypes_index);
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
	adminRouter.get('/assets/search', mediaassetController.loadAssets, adminController.assets_index);
	mediaRouter.post('/new', mediaassetController.upload, mediaassetController.createassetfile);
	mediaRouter.post('/:id/delete', mediaassetController.loadAsset, mediaassetController.remove);
	mediaRouter.post('/edit', mediaassetController.update);
	mediaRouter.post('/removechangeset/:id/:contententity/:changesetnum', mediaassetController.loadAsset, adminController.remove_changeset_from_content, mediaassetController.update);

	mediaAdminRouter.get('/edit/:id', mediaassetController.loadAsset, adminController.asset_show);
	mediaAdminRouter.get('/:id', mediaassetController.loadAsset, adminController.asset_show);

	/**
	 * admin/user routes
	 */
	adminRouter.get('/users/search', userController.loadUsers, adminController.users_index);
	userAdminRouter.get('/new', adminController.users_new);
	userAdminRouter.get('/:id', userController.loadUser, adminController.users_show);
	userAdminRouter.get('/:id/edit', userController.loadUser, adminController.users_edit);
	userAdminRouter.post('/edit', userController.update);
	userAdminRouter.post('/new', userController.create);
	userAdminRouter.post('/:id/delete', userController.loadUser, userController.remove);


	/**
	 * admin/settings routes
	 */
	settingsAdminRouter.get('/', adminSettingsController.load_app_settings, adminSettingsController.load_theme_settings, adminController.settings_index);
	settingsAdminRouter.get('/faq', adminController.settings_faq);
	settingsAdminRouter.post('/restart', adminSettingsController.restart_app);
	settingsAdminRouter.post('/updateapp', adminSettingsController.update_app);
	settingsAdminRouter.post('/updateappsettings', adminSettingsController.update_app_settings);
	settingsAdminRouter.post('/updatethemesettings', adminSettingsController.update_theme_settings);

	settingsAdminRouter.post('/updateextfiledata', adminSettingsController.update_ext_filedata);
	settingsAdminRouter.post('/themefiledata', adminSettingsController.update_theme_filedata);

	/**
	 * periodic routes
	 */
	adminRouter.get('/user/search.:ext', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	adminRouter.get('/user/search', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	adminRouter.get('/category/search.:ext', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	adminRouter.get('/category/search', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	adminRouter.get('/category/:id/children', global.CoreCache.disableCache, categoryController.loadCategory, categoryController.loadChildren, categoryController.showChildren);
	adminRouter.get('/contenttype/search.:ext', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	adminRouter.get('/contenttype/search', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	adminRouter.get('/tag/search.:ext', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	adminRouter.get('/tag/search', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	adminRouter.get('/tag/:id/children', global.CoreCache.disableCache, tagController.loadTag, tagController.loadChildren, tagController.showChildren);

	adminRouter.use('/asset', mediaAdminRouter);
	adminRouter.use('/extension', extensionAdminRouter);
	adminRouter.use('/theme', themeAdminRouter);
	adminRouter.use('/contenttype', contenttypeAdminRouter);
	adminRouter.use('/tag', tagAdminRouter);
	adminRouter.use('/category', categoryAdminRouter);
	adminRouter.use('/user', userAdminRouter);
	adminRouter.use('/settings', settingsAdminRouter);
	periodic.app.use('/p-admin', adminRouter);
	periodic.app.use('/item', itemRouter);
	periodic.app.use('/collection', collectionRouter);
	periodic.app.use('/compilation', compilationRouter);
	periodic.app.use('/tag', tagRouter);
	periodic.app.use('/category', categoryRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/mediaasset', mediaRouter);
	// periodic.app.use(periodicRouter);
};
