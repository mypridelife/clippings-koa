import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';
import * as path from 'path';

import userController from '../controllers/user';
import baseController from '../controllers/base';
import clippingController from '../controllers/clipping';
import fileController from '../controllers/file';

const router = new Router();

// 用户
router.post('/api/user/login', userController.login);
router.post('/api/user/register', userController.register);

// 邮箱激活
router.get('/api/user/activation', userController.userActivation);

router.get('/api/user/:id', userController.getUserById);
router.put('/api/user/:id', userController.updateUserById);
router.put('/api/user/:id/password', userController.updateUserPassword);

// 基础模块
router.get('/api/base/options', baseController.getOptions);
router.post(
  '/api/base/upload',
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../assets/uploads/')
    }
  }),
  baseController.uploadPhoto
);

// 文章模块
router.post('/api/clipping/add', clippingController.add);
router.post('/api/clipping/delete', clippingController.delete);
router.post('/api/clipping/update', clippingController.update);
router.post('/api/clipping/find', clippingController.find);
router.post(
  '/api/clipping/findAllAndCount',
  clippingController.findAllAndCount
);
router.post(
  '/api/clipping/findAllFavorite',
  clippingController.findAllFavorite
);
router.post(
  '/api/clipping/findAllClippingsByBook',
  clippingController.findAllClippingsByBook
);
router.post('/api/clipping/findAllBook', clippingController.findAllBook);
router.post('/api/clipping/searchNorAorC', clippingController.searchNorAorC);

// 文件模块
router.post(
  '/api/file/add',
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../assets/uploads/')
    }
  }),
  fileController.add
);
router.post('/api/file/delete', fileController.delete);
router.post('/api/file/find', fileController.find);
router.post('/api/file/findAll', fileController.findAll);
router.post('/api/file/findAllAndCount', fileController.findAllAndCount);

router.post('/api/file/analysisFile', fileController.analysisFile);

export { router };
