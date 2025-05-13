const express = require('express')
const router = express.Router()
const { saveChat, getUserChats, updateChat, submitFeedback } = require('../controllers/chatController')
const auth = require('../middleware/auth');

router.post('/save', auth, saveChat)
router.get('/list', auth, getUserChats);
router.put('/update/:id', auth, updateChat);
router.post('/feedback', auth, submitFeedback);

module.exports = router
