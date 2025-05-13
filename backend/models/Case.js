'use strict';
module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('Case', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    },
    lawyerId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    consultId: DataTypes.INTEGER,
    files: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {});

  Case.associate = function(models) {
    Case.belongsTo(models.User, { as: 'lawyer', foreignKey: 'lawyerId' });
    Case.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Case.belongsTo(models.Consult, { foreignKey: 'consultId', as: 'consult' });
    Case.hasMany(models.CaseProgress, {
      foreignKey: 'caseId',
      as: 'progresses'
    });
  };

  return Case;
};
