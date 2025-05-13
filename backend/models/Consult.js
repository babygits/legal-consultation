module.exports = (sequelize, DataTypes) => {
  const Consult = sequelize.define('Consult', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    lawyerId: { type: DataTypes.INTEGER },
    question: { type: DataTypes.TEXT, allowNull: false },
    reply: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'answered', 'unresolved', 'resolved'),
      defaultValue: 'pending'
    }
  });

  Consult.associate = function(models) {
    Consult.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Consult.belongsTo(models.User, { foreignKey: 'lawyerId', as: 'lawyer' });
    Consult.belongsTo(models.Case, { foreignKey: 'caseId', as: 'case' });
  };

  return Consult;
};
