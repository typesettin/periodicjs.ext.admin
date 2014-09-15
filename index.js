'use strict';
var path = require('path');

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
		adminController = require('./controller/admin')(periodic),
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
	tagRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	mediaRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	userAdminRouter.all('*', authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);

	/**
	 * admin routes
	 */
	// adminRouter.get('/',authController.ensureAuthenticated,adminController.index);
	adminRouter.get('/', function (req, res) {
		res.redirect('/p-admin/user/' + req.user.username);
	});
	adminRouter.get('/items', itemController.loadItems, adminController.items_index);
	adminRouter.get('/contenttypes', contenttypeController.loadContenttypes, adminController.contenttypes_index);
	adminRouter.get('/tags', tagController.loadTags, adminController.tags_index);
	adminRouter.get('/categories', categoryController.loadCategories, adminController.categories_index);
	adminRouter.get('/collections', collectionController.loadCollections, adminController.collections_index);
	adminRouter.get('/assets', mediaassetController.loadAssets, adminController.assets_index);
	adminRouter.get('/extensions', adminController.loadExtensions, adminController.extensions_index);
	adminRouter.get('/themes', adminController.loadThemes, adminController.themes_index);
	adminRouter.get('/users', uacController.loadUacUsers, adminController.users_index);
	adminRouter.get('/mailer', adminController.mail_index);
	adminRouter.get('/settings', adminController.settings_index);
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
	extensionAdminRouter.get('/:id', adminController.loadExtension, adminController.extension_show);
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
	 * admin/post manager routes
	 */
	adminRouter.get('/item/new', adminController.item_new);
	adminRouter.get('/item/edit/:id', itemController.loadFullItem, adminController.item_edit);
	itemRouter.post('/new', itemController.create);
	itemRouter.post('/edit', itemController.update);
	itemRouter.post('/:id/delete', itemController.loadItem, itemController.remove);
	/**
	 * admin/collection manager routes
	 */
	adminRouter.get('/collection/new', adminController.collection_new);
	adminRouter.get('/collection/edit/:id', collectionController.loadCollection, adminController.collection_edit);
	collectionRouter.post('/new', collectionController.create);
	collectionRouter.post('/edit', collectionController.update);
	collectionRouter.post('/append/:id', collectionController.loadCollection, collectionController.append);
	collectionRouter.post('/:id/delete', collectionController.loadCollection, collectionController.remove);

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
	/**
	 * admin/user routes
	 */
	userAdminRouter.get('/new', adminController.users_new);
	userAdminRouter.get('/:id', userController.loadUser, adminController.users_show);
	userAdminRouter.get('/:id/edit', userController.loadUser, adminController.users_edit);
	userAdminRouter.post('/edit', userController.update);
	userAdminRouter.post('/new', userController.create);
	userAdminRouter.post('/:id/delete', userController.loadUser, userController.remove);

	// userAdminRouter.post('/new',authController.ensureAuthenticated,mediaassetController.upload,mediaassetController.createassetfile);

	/**
	 * periodic routes
	 */
	periodicRouter.get('/user/search.:ext', userController.loadUsers, userController.searchResults);
	periodicRouter.get('/user/search', userController.loadUsers, userController.searchResults);
	periodicRouter.get('/category/search.:ext', categoryController.loadCategories, categoryController.searchResults);
	periodicRouter.get('/category/search', categoryController.loadCategories, categoryController.searchResults);
	periodicRouter.get('/contenttype/search.:ext', contenttypeController.loadContenttypes, contenttypeController.searchResults);
	periodicRouter.get('/contenttype/search', contenttypeController.loadContenttypes, contenttypeController.searchResults);
	periodicRouter.get('/tag/search.:ext', tagController.loadTags, tagController.searchResults);
	periodicRouter.get('/tag/search', tagController.loadTags, tagController.searchResults);

	adminRouter.use('/asset', mediaAdminRouter);
	adminRouter.use('/extension', extensionAdminRouter);
	adminRouter.use('/theme', themeAdminRouter);
	adminRouter.use('/contenttype', contenttypeAdminRouter);
	adminRouter.use('/tag', tagAdminRouter);
	adminRouter.use('/category', categoryAdminRouter);
	adminRouter.use('/user', userAdminRouter);
	periodic.app.use('/p-admin', adminRouter);
	periodic.app.use('/item', itemRouter);
	periodic.app.use('/collection', collectionRouter);
	periodic.app.use('/tag', tagRouter);
	periodic.app.use('/category', categoryRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/mediaasset', mediaRouter);
	periodic.app.use(periodicRouter);
};
