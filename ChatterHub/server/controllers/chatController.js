const Chat = require('../models/chatModel');

const createChat = async (req, res) => {
    const { participantId } = req.body;

    if (!participantId) {
        return res.status(400).json({ message: 'Participant ID required' });
    }

    let chat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [req.user._id, participantId] }
    });

    if (chat) {
        res.json(chat);
    } else {
        chat = await Chat.create({
            participants: [req.user._id, participantId]
        });
        res.status(201).json(chat);
    }
};

const fetchChats = async (req, res) => {
    const chats = await Chat.find({ participants: req.user._id })
        .populate('participants', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });
    res.json(chats);
};

module.exports = { createChat, fetchChats };
