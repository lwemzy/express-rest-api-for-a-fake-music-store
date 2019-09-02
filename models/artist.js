'use strict';
module.exports = (sequelize, DataTypes) => {
  const artist = sequelize.define(
    'artist',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dob: DataTypes.DATE,
      dod: DataTypes.DATE
    },
    {}
  );
  artist.associate = function(models) {
    // associations can be defined here
    artist.belongsToMany(models.album, {
      through: 'albumCollab',
      foreignKey: 'artistId',
      as: 'artists'
    });
  };
  return artist;
};
