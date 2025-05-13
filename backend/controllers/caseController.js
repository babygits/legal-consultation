const { Case, User, Consult, CaseProgress } = require('../models');

exports.createCase = async (req, res) => {
  const { title, description, userId, consultId } = req.body;
  const lawyerId = req.user.userId;

  if (!title || !description || !userId) {
    return res.status(400).json({ message: '缺少必要字段' });
  }

  try {
    const newCase = await Case.create({
      title,
      description,
      userId,
      lawyerId,
      consultId: consultId || null
    });

    res.status(201).json({ message: '案件创建成功', case: newCase });
  } catch (err) {
    res.status(500).json({ message: '创建失败', error: err.message });
  }
};

exports.getLawyerCases = async (req, res) => {
  try {
    const lawyerId = req.user.userId;

    const cases = await Case.findAll({
      where: { lawyerId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Consult, as: 'consult', attributes: ['id', 'question'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: '获取案件失败', error: err.message });
  }
};


exports.getCaseDetail = async (req, res) => {
  const caseId = req.params.id;

  try {
    // 获取案件的基本信息，包括案件进展和用户信息
    const caseDetail = await Case.findByPk(caseId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'lawyer', attributes: ['id', 'name', 'email'] },
        { model: CaseProgress, as: 'progresses', attributes: ['id', 'content', 'createdAt'] }
      ]
    });

    if (!caseDetail) {
      return res.status(404).json({ message: '案件不存在' });
    }

    res.json(caseDetail);
  } catch (err) {
    res.status(500).json({ message: '获取案件详情失败', error: err.message });
  }
};


exports.addCaseProgress = async (req, res) => {
  const caseId = req.params.id;
  const { content } = req.body;

  try {
    const progress = await CaseProgress.create({ caseId, content });
    res.status(201).json({ message: '进展记录已添加', data: progress });
  } catch (err) {
    res.status(500).json({ message: '添加失败', error: err.message });
  }
};


exports.getCaseProgress = async (req, res) => {
  const caseId = req.params.id;
  try {
    const progressList = await CaseProgress.findAll({
      where: { caseId },
      order: [['createdAt', 'ASC']]
    });
    res.json(progressList);
  } catch (err) {
    res.status(500).json({ message: '查询失败', error: err.message });
  }
};


exports.getUserCases = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cases = await Case.findAll({
      where: { userId },
      include: [
        { model: User, as: 'lawyer', attributes: ['id', 'name'] },
        { model: Consult, as: 'consult', attributes: ['id', 'question'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: '查询失败', error: err.message });
  }
};

exports.uploadCaseFile = async (req, res) => {
  try {
    const file = req.file
    const caseId = req.params.id

    if (!file) return res.status(400).json({ message: '未上传文件' })

    const targetCase = await Case.findByPk(caseId)
    if (!targetCase) return res.status(404).json({ message: '案件不存在' })

    const filePath = `/uploads/casefiles/${file.filename}`

    // 将路径添加进 files 数组
    const existingFiles = targetCase.files || []
    targetCase.files = [...existingFiles, filePath];
    await targetCase.save()
    console.log('保存后 files:', targetCase.files);

    res.json({ message: '文件上传成功', fileUrl: filePath })
  } catch (err) {
    res.status(500).json({ message: '上传失败', error: err.message })
  }
}
