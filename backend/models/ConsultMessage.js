'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConsultMessage = sequelize.define('ConsultMessage', {
    consultId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    senderRole: {
      type: DataTypes.STRING,
      allowNull: false // 'user' or 'lawyer'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  ConsultMessage.associate = function(models) {
    ConsultMessage.belongsTo(models.Consult, { foreignKey: 'consultId' });
    ConsultMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  };

  return ConsultMessage;
};
