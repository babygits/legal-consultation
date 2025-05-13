const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret'; // 可改为 process.env.JWT_SECRET

exports.register = async (req, res) => {
  const { email, phone, password, name, idNumber, role } = req.body;

  if (!password || (!email && !phone) || !name || !idNumber || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      name,
      idNumber,
      role,
      lawyerStatus: role === 'lawyer' ? 'pending' : null,
    });

    res.status(201).json({ message: 'Registration successful', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ message: 'Register failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, phone, password } = req.body;
  const where = email ? { email } : { phone };

  try {
    const user = await User.findOne({ where });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password'] } });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, avatar, bio, phone, email, price, balance } = req.body;

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 仅更新提供的字段
    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;
    if (price !== undefined) user.price = price;
    if (balance !== undefined) user.balance = balance;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.uploadCertFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user || user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can upload certification' });
    }

    user.certFile = req.file.path; // 或自定义 URL 拼接
    user.lawyerStatus = 'pending';
    await user.save();

    res.json({ message: 'Certification uploaded', path: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '未上传文件' });

  // 使用完整 URL
  const baseUrl = req.protocol + '://' + req.get('host');
  const avatarUrl = `${baseUrl}/uploads/avatar/${req.file.filename}`;

  try {
    const user = await User.findByPk(req.user.userId);
    user.avatar = avatarUrl;
    await user.save();

    res.json({ message: '上传成功', url: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: '上传失败', error: err.message });
  }
};


exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: '请填写原密码和新密码' });
  }

  try {
    const user = await User.findByPk(req.user.userId);

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '原密码错误' });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: '密码已更新' });
  } catch (err) {
    res.status(500).json({ message: '密码更新失败', error: err.message });
  }
};
