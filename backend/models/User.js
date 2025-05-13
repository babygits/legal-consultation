module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    idNumber: { type: DataTypes.STRING },
    major: { type: DataTypes.JSON },
    avatar: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    certFile: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    lawyerStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    indexes: [
      { unique: true, fields: ['email'] }
    ]
  });

  return User;
};
