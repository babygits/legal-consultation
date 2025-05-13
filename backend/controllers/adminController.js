const { User, Case, CaseProgress, Consult, ChatLog } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: {
        role: 'lawyer',
        lawyerStatus: 'pending'
      },
      attributes: [
        'id', 'name', 'email', 'phone', 'idNumber',
        'avatar', 'bio', 'certFile', 'createdAt', 'major'
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ lawyers });
  } catch (err) {
    res.status(500).json({ message: '获取失败', error: err.message });
  }
};

exports.verifyLawyer = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const lawyer = await User.findByPk(req.params.id);

    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(404).json({ message: '律师用户不存在' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: '非法状态' });
    }

    lawyer.lawyerStatus = status;
    await lawyer.save();

    res.json({ message: `认证${status === 'approved' ? '通过' : '已拒绝'}` });
  } catch (err) {
    res.status(500).json({ message: '审核失败', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '仅限管理员访问' })
    }

    const users = await User.findAll({
      attributes: [
        'id',
        'email',
        'phone',
        'name',
        'role',
        'lawyerStatus',
        'createdAt',
        'major'
      ],
      order: [['createdAt', 'DESC']]
    })

    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: '获取用户失败', error: err.message })
  }
}


exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: '邮箱和密码不能为空' });

    const user = await User.create({ name, email, phone, password, role });
    res.json({ message: '用户创建成功', user });
  } catch (err) {
    res.status(500).json({ message: '创建失败', error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    const { name, phone, role, email } = req.body;
    user.name = name;
    user.phone = phone;
    user.email = email;
    user.role = role;
    await user.save();

    res.json({ message: '更新成功', user });
  } catch (err) {
    res.status(500).json({ message: '更新失败', error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    await user.destroy();
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除失败', error: err.message });
  }
};


exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'lawyer', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ cases });
  } catch (err) {
    res.status(500).json({ message: '获取案件失败', error: err.message });
  }
};


exports.updateCaseStatus = async (req, res) => {
  try {
    const target = await Case.findByPk(req.params.id);
    if (!target) return res.status(404).json({ message: '案件不存在' });

    target.status = req.body.status;
    await target.save();

    res.json({ message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ message: '更新失败', error: err.message });
  }
};


exports.deleteCase = async (req, res) => {
  try {
    const target = await Case.findByPk(req.params.id);
    if (!target) return res.status(404).json({ message: '案件不存在' });

    await target.destroy();
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除失败', error: err.message });
  }
};

exports.getCaseDetail = async (req, res) => {
  try {
    const targetCase = await Case.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'lawyer', attributes: ['id', 'name', 'email'] },
        { model: CaseProgress, as: 'progresses' }
      ]
    });

    if (!targetCase) {
      return res.status(404).json({ message: '案件不存在' });
    }

    res.json({ case: targetCase });
  } catch (err) {
    res.status(500).json({ message: '获取案件详情失败', error: err.message });
  }
};


exports.getAllConsults = async (req, res) => {
  try {
    const consults = await Consult.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Case, as: 'case', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    })

    res.json({ consults })
  } catch (err) {
    res.status(500).json({ message: '获取失败', error: err.message })
  }
}


exports.deleteConsult = async (req, res) => {
  try {
    const c = await Consult.findByPk(req.params.id)
    if (!c) return res.status(404).json({ message: '咨询不存在' })

    await c.destroy()
    res.json({ message: '已删除' })
  } catch (err) {
    res.status(500).json({ message: '删除失败', error: err.message })
  }
}


exports.getConsultDetail = async (req, res) => {
  try {
    const consult = await Consult.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Case, as: 'case', attributes: ['id', 'title'] }
      ]
    })

    if (!consult) {
      return res.status(404).json({ message: '咨询不存在' })
    }

    res.json({ consult })
  } catch (err) {
    res.status(500).json({ message: '获取咨询详情失败', error: err.message })
  }
}


exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await ChatLog.findAll({
      where: {
        rating: { [Op.not]: null }
      },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    })

    res.json({ feedbacks })
  } catch (err) {
    res.status(500).json({ message: '获取反馈失败', error: err.message })
  }
}

exports.getAdminStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const pendingLawyers = await User.count({
      where: { role: 'lawyer', lawyerStatus: 'pending' }
    });
    const caseCount = await Case.count();
    const consultCount = await Consult.count();
    const ratedLogs = await ChatLog.findAll({
      where: { rating: { [Op.not]: null } },
      attributes: ['rating']
    });

    const avgRating = ratedLogs.length
      ? (ratedLogs.reduce((sum, r) => sum + r.rating, 0) / ratedLogs.length).toFixed(2)
      : '无';

    res.json({
      userCount,
      pendingLawyers,
      caseCount,
      consultCount,
      avgRating
    });
  } catch (err) {
    res.status(500).json({ message: '获取统计失败', error: err.message });
  }
};


exports.getUserGrowth = async (req, res) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      label: `${date.getMonth() + 1}月`,
      start: date,
      end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
    };
  });

  const results = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const count = await User.count({ where: { createdAt: { [Op.between]: [start, end] } } });
      return { label, value: count };
    })
  );

  res.json({ growth: results });
};

exports.getUserRoles = async (req, res) => {
  const roles = ['user', 'lawyer', 'admin'];
  const counts = await Promise.all(
    roles.map(role => User.count({ where: { role } }))
  );
  res.json({ roles: roles.map((r, i) => ({ name: r, value: counts[i] })) });
};

exports.getCaseStatusStats = async (req, res) => {
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];
  const counts = await Promise.all(
    statuses.map(status => Case.count({ where: { status } }))
  );
  res.json({ cases: statuses.map((s, i) => ({ name: s, value: counts[i] })) });
};


exports.getCaseTrend = async (req, res) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      month: `${d.getMonth() + 1}月`,
      start: d,
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1)
    };
  });

  const trend = await Promise.all(
    months.map(async ({ month, start, end }) => {
      const [open, inProgress, resolved, closed] = await Promise.all([
        Case.count({ where: { status: 'open', createdAt: { [Op.between]: [start, end] } } }),
        Case.count({ where: { status: 'in-progress', createdAt: { [Op.between]: [start, end] } } }),
        Case.count({ where: { status: 'resolved', createdAt: { [Op.between]: [start, end] } } }),
        Case.count({ where: { status: 'closed', createdAt: { [Op.between]: [start, end] } } })
      ]);
      return { month, open, inProgress, resolved, closed };
    })
  );

  res.json({ trend });
};


exports.getConsultDaily = async (req, res) => {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 59); // 60天范围

  const records = await Consult.findAll({
    where: { createdAt: { [Op.between]: [past, now] } },
    attributes: [[fn('DATE', col('createdAt')), 'date'], [fn('COUNT', '*'), 'count']],
    group: ['date'],
    order: [['date', 'ASC']]
  });

  const daily = records.map(r => ({
    date: r.getDataValue('date'),
    count: parseInt(r.getDataValue('count'))
  }));

  res.json({ daily });
};

