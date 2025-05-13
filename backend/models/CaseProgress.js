'use strict';
module.exports = (sequelize, DataTypes) => {
  const CaseProgress = sequelize.define('CaseProgress', {
    caseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  CaseProgress.associate = function(models) {
    CaseProgress.belongsTo(models.Case, { foreignKey: 'caseId' });
  };

  return CaseProgress;
};
