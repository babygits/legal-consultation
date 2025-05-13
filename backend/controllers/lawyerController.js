const { Case, User, Consult} = require('../models');

exports.getMyCases = async (req, res) => {
  try {
    const lawyerId = req.user.userId;

    const cases = await Case.findAll({
      where: { lawyerId },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cases', error: err.message });
  }
};

exports.getAllApprovedLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: {
        role: 'lawyer',
        lawyerStatus: 'approved'
      },
      attributes: ['id', 'name', 'email', 'avatar', 'bio', 'major']
    });

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lawyers', error: err.message });
  }
};

exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'avatar', 'bio', 'role', 'price', 'major']
    });

    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(404).json({ message: '未找到该律师' });
    }

    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: '获取律师失败', error: err.message });
  }
};

exports.getLawyerConsults = async (req, res) => {
  try {
    const userId = req.user.userId;
    const consults = await Consult.findAll({
      where: { lawyerId: userId },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(consults);
  } catch (err) {
    res.status(500).json({ message: '获取咨询记录失败', error: err.message });
  }
};


exports.uploadCert = (req, res) => {
  if (!req.file) return res.status(400).json({ message: '文件上传失败' });

  const baseUrl = req.protocol + '://' + req.get('host');
  const fileUrl = `${baseUrl}/uploads/certs/${req.file.filename}`;
  res.json({ url: fileUrl });
};

exports.submitVerification = async (req, res) => {
  const { certFile, bio, major } = req.body;

  if (!certFile || !bio || !major) {
    return res.status(400).json({ message: '请提供认证材料和简介' });
  }

  try {
    const user = await User.findByPk(req.user.userId);
    user.certFile = certFile;
    user.bio = bio;
    user.major = major;
    user.lawyerStatus = 'pending';
    await user.save();

    res.json({ message: '认证申请已提交' });
  } catch (err) {
    res.status(500).json({ message: '提交失败', error: err.message });
  }
};




