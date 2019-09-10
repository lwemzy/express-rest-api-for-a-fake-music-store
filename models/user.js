const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: `Please enter a valid email address`
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: {
            args: 8,
            msg: `Password should be more that eight character's`
          }
        }
      },
      // passwordConfirm: {
      //   type: DataTypes.STRING,
      //   allowNull: false
      // },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        default: true
      }
    },
    {
      // instanceMethods: {
      //   validPassword: async function(password) {
      //     return await bcrypt.compare(password, this.password);
      //   }
      // }
    }
  );
  user.associate = function(models) {
    // associations can be defined here
  };

  user.beforeCreate(async function(userpass, options) {
    // this.removeAttribute('passwordConfirm');
    userpass.password = await bcrypt.hash(userpass.password, 12);
  });

  // instance methonds are defined using prototype
  // to avoid bugs from sequelize
  user.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return user;
};

// passwordConfirm: {
//   type: DataTypes.STRING,
//   allowNull: false,
//   validate: {
//     matchPasswors: function(value) {
//       if (value != this.password) {
//         throw new Error(`Password's don't match`);
//       }
//     }
//   }
// },
