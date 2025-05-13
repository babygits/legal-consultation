'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChatLog = sequelize.define('ChatLog', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messages: {
      type: DataTypes.JSON,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER, // 1-5 星
      allowNull: true
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ChatLogs',
    timestamps: true
  });

  ChatLog.associate = function(models) {
    ChatLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return ChatLog;
};
