const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const auth = require('../middleware/auth');
const multer = require('multer')
const path = require('path')


router.post('/', auth, caseController.createCase);
router.get('/lawyer', auth, caseController.getLawyerCases);
router.get('/user', auth, caseController.getUserCases);
router.get('/:id', auth, caseController.getCaseDetail);
router.post('/:id/progress', auth, caseController.addCaseProgress);
router.get('/:id/progress', auth, caseController.getCaseProgress);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/casefiles')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `case-${req.params.id}-${Date.now()}${ext}`)
  }
})

const upload = multer({ storage })

router.post(
  '/:id/files',
  auth,
  upload.single('file'),
  caseController.uploadCaseFile
)

module.exports = router;
