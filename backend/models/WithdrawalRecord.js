'use strict';
module.exports = (sequelize, DataTypes) => {
  const WithdrawalRecord = sequelize.define('WithdrawalRecord', {
    lawyerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  WithdrawalRecord.associate = function(models) {
    WithdrawalRecord.belongsTo(models.User, { foreignKey: 'lawyerId', as: 'lawyer' });
  };

  return WithdrawalRecord;
};
