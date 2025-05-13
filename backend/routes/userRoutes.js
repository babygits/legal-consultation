const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);


// 保存文件到 /uploads 目录
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 请确保 backend/uploads 文件夹存在
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.userId + '-' + uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post(
  '/upload-cert',
  authMiddleware,
  upload.single('certFile'),
  userController.uploadCertFile
);

const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatar/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.userId + '-' + Date.now() + ext);
  }
});

const uploadAvatar = multer({ storage: storageAvatar });
router.post('/avatar', authMiddleware, uploadAvatar.single('avatar'), userController.uploadAvatar);

module.exports = router;
