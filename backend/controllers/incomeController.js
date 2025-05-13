const { WithdrawalRecord } = require('../models');

// GET /api/income/total
exports.getTotalIncome = async (req, res) => {
  const lawyerId = req.user.userId;
  const { User } = require('../models');

  const user = await User.findByPk(lawyerId);
  res.json({ balance: user.balance });
};


// GET /api/income/details
exports.getIncomeDetails = async (req, res) => {
  const lawyerId = req.user.userId;
  const { Consult, User } = require('../models');

  const records = await Consult.findAll({
    where: { lawyerId, status: 'resolved' },
    include: [{ model: User, as: 'user', attributes: ['name'] }],
    attributes: ['id', 'question', 'price', 'createdAt']
  });

  res.json(records);
};


// POST /api/income/withdraw
exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  const lawyerId = req.user.userId;
  const { User, WithdrawalRecord } = require('../models');

  const user = await User.findByPk(lawyerId);

  if (amount > user.balance) {
    return res.status(400).json({ message: '余额不足' });
  }

  user.balance -= amount;
  await user.save();

  await WithdrawalRecord.create({ lawyerId, amount });

  res.json({ message: '提现成功', newBalance: user.balance });
};

// GET /api/income/withdrawals
exports.getWithdrawals = async (req, res) => {
  const lawyerId = req.user.userId;
  const { WithdrawalRecord } = require('../models');

  const records = await WithdrawalRecord.findAll({
    where: { lawyerId },
    order: [['createdAt', 'DESC']]
  });

  res.json(records);
};

