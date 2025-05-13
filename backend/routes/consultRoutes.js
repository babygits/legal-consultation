const express = require('express');
const router = express.Router();
const consultController = require('../controllers/consultController');
const auth = require('../middleware/auth');

router.post('/', auth, consultController.createConsult);
router.get('/user', auth, consultController.getUserConsults);
router.get('/lawyer', auth, consultController.getLawyerConsults);
router.get('/:id', auth, consultController.getConsultDetail);
router.put('/:id/reply', auth, consultController.replyToConsult);
router.put('/:id/status', auth, consultController.updateConsultStatus);
router.get('/:id/messages', auth, consultController.getMessages);
router.post('/:id/messages', auth, consultController.sendMessage);

module.exports = router;
