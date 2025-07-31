const express = require('express');
const { createChat, fetchChats } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createChat);
router.get('/', protect, fetchChats);

module.exports = router;
