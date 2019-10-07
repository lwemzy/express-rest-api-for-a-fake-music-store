'use strict';
module.exports = (sequelize, DataTypes) => {
  const album = sequelize.define(
    'album',
    {
      name: DataTypes.STRING,
      albumArt: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      description: DataTypes.TEXT
    },
    {}
  );
  album.associate = function(models) {
    // associations can be defined here
    album.hasMany(models.song, { as: 'songs' });
    album.belongsToMany(models.artist, {
      through: 'albumCollab',
      foreignKey: 'albumId',
      as: 'artists'
    });
  };
  return album;
};
