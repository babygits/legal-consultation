const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

router.get('/cases', auth, lawyerController.getMyCases);
router.get('/consults', auth, lawyerController.getLawyerConsults);
router.get('/', lawyerController.getAllApprovedLawyers);
router.get('/:id', lawyerController.getLawyerById);

const certDir = path.join(__dirname, '../uploads/certs');
fs.mkdirSync(certDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, certDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'cert-' + req.user.userId + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

router.post('/verify/upload', auth, upload.single('certFile'), lawyerController.uploadCert);
router.post('/verify', auth, lawyerController.submitVerification);

module.exports = router;
