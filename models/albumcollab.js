'use strict';
module.exports = (sequelize, DataTypes) => {
  const albumCollab = sequelize.define(
    'albumCollab',
    {
      artistId: DataTypes.INTEGER,
      albumId: DataTypes.INTEGER
    },
    {}
  );
  albumCollab.associate = function(models) {
    // associations can be defined here
    albumCollab.belongsTo(models.album, { foreignKey: 'albumId' });
    albumCollab.belongsTo(models.artist, { foreignKey: 'artistId' });
  };
  return albumCollab;
};
