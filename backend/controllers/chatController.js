const { ChatLog } = require('../models')

exports.saveChat = async (req, res) => {
  try {
    const userId = req.user.userId
    const { messages } = req.body

    if (!userId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: '请求参数错误' })
    }

    const newLog = await ChatLog.create({
      userId,
      messages
    })

    res.json({ message: '对话保存成功', chatId: newLog.id })
  } catch (err) {
    res.status(500).json({ message: '保存失败', error: err.message })
  }
}


exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await ChatLog.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'messages', 'createdAt', 'rating', 'feedback']
    });

    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: '获取聊天记录失败', error: err.message });
  }
};


exports.updateChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = req.params.id;
    const { messages } = req.body;

    const chat = await ChatLog.findOne({
      where: { id: chatId, userId }
    });

    if (!chat) return res.status(404).json({ message: '对话不存在或无权限' });

    chat.messages = messages;
    await chat.save();

    res.json({ message: '更新成功' });
  } catch (err) {
    res.status(500).json({ message: '更新失败', error: err.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chatId, rating, feedback } = req.body;

    const chat = await ChatLog.findOne({
      where: { id: chatId, userId }
    });

    if (!chat) return res.status(404).json({ message: '对话不存在或无权限' });

    chat.rating = rating;
    chat.feedback = feedback;
    await chat.save();

    res.json({ message: '反馈已提交' });
  } catch (err) {
    res.status(500).json({ message: '反馈失败', error: err.message });
  }
};


