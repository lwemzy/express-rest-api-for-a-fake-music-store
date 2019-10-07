'use strict';
module.exports = (sequelize, DataTypes) => {
  const song = sequelize.define(
    'song',
    {
      albumId: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      artist: DataTypes.STRING,
      composer: DataTypes.STRING,
      year: DataTypes.DATE
    },
    {}
  );
  song.associate = function(models) {
    // associations can be defined here
    song.hasMany(models.songreview, { as: 'reviews' });
    song.belongsTo(models.genre, { foreignKey: 'genreId', as: 'genre' });
    song.belongsTo(models.album, { foreignKey: 'albumId', as: 'album' });
  };
  return song;
};
