const { Case, User, Consult, ConsultMessage, sequelize } = require('../models');

exports.createConsult = async (req, res) => {
  const { lawyerId, question, price, status } = req.body;
  const userId = req.user.userId;

  if (!lawyerId || !question || !price || !status) {
    return res.status(400).json({ message: '缺少必要字段' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (user.balance < parseFloat(price)) {
      return res.status(400).json({ message: '余额不足，请先前往个人中心中充值' });
    }

    const lawyer = await User.findByPk(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ message: '律师不存在' });
    }

    // 开启事务，确保扣款和创建是原子操作
    const result = await sequelize.transaction(async (t) => {
      user.balance -= parseFloat(price);
      lawyer.balance += parseFloat(price)
      await user.save({ transaction: t });
      await lawyer.save({ transaction: t });

      const newConsult = await Consult.create({
        userId,
        lawyerId,
        question,
        price,
        status
      }, { transaction: t });

      return newConsult;
    });

    res.status(201).json({ message: '咨询创建成功，已扣款', consultId: result.id });
  } catch (err) {
    res.status(500).json({ message: '创建失败', error: err.message });
  }
};


exports.getUserConsults = async (req, res) => {
  try {
    const userId = req.user.userId;
    const consults = await Consult.findAll({
      where: { userId },
      include: [{ model: User, as: 'lawyer', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(consults);
  } catch (err) {
    res.status(500).json({ message: '获取咨询记录失败', error: err.message });
  }
};


exports.getConsultDetail = async (req, res) => {
  try {
    const consult = await Consult.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: User, as: 'lawyer', attributes: ['id', 'name'] }
      ],
    });

    if (!consult) return res.status(404).json({ message: '咨询不存在' });
    res.json(consult);
  } catch (err) {
    res.status(500).json({ message: '查询失败', error: err.message });
  }
};

exports.replyToConsult = async (req, res) => {
  try {
    const { reply } = req.body;
    const consult = await Consult.findByPk(req.params.id);
    if (!consult) return res.status(404).json({ message: '咨询不存在' });

    consult.reply = reply;
    await consult.save();

    res.json({ message: '回复成功' });
  } catch (err) {
    res.status(500).json({ message: '回复失败', error: err.message });
  }
};

exports.updateConsultStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const consult = await Consult.findByPk(req.params.id);
    if (!consult) return res.status(404).json({ message: '咨询不存在' });

    consult.status = status;
    await consult.save();

    res.json({ message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ message: '更新失败', error: err.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const messages = await ConsultMessage.findAll({
      where: { consultId: req.params.id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: '获取消息失败', error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { content } = req.body;
  const senderId = req.user.userId;
  const senderRole = req.user.role;

  if (!content) {
    return res.status(400).json({ message: '消息内容不能为空' });
  }

  try {
    const newMsg = await ConsultMessage.create({
      consultId: req.params.id,
      senderId,
      senderRole,
      content
    });

    res.status(201).json({ message: '发送成功', data: newMsg });
  } catch (err) {
    res.status(500).json({ message: '发送失败', error: err.message });
  }
};

exports.getLawyerConsults = async (req, res) => {
  const lawyerId = req.user.userId;

  try {
    const consults = await Consult.findAll({
      where: { lawyerId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(consults);
  } catch (err) {
    res.status(500).json({ message: '获取咨询失败', error: err.message });
  }
};
