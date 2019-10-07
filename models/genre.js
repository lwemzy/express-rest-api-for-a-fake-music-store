'use strict';
module.exports = (sequelize, DataTypes) => {
  const genre = sequelize.define(
    'genre',
    {
      type: DataTypes.STRING
    },
    {}
  );
  genre.associate = function(models) {
    // associations can be defined here
    genre.hasMany(models.song, { as: 'songs' });
  };
  return genre;
};
