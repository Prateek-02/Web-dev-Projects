const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const message = await Message.create({
        chatId,
        senderId: req.user._id,
        content
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
};

const getMessages = async (req, res) => {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
        .populate('senderId', 'username profilePic')
        .sort({ createdAt: 1 });
    res.json(messages);
};

module.exports = { sendMessage, getMessages };
