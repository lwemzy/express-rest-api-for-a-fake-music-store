'use strict';
module.exports = (sequelize, DataTypes) => {
  const songreview = sequelize.define(
    'songreview',
    {
      songId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      review: DataTypes.STRING
    },
    {}
  );
  songreview.associate = function(models) {
    // associations can be defined here
    songreview.belongsTo(models.song, { foreignKey: 'songId', as: 'song' });
    songreview.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
  };
  return songreview;
};
