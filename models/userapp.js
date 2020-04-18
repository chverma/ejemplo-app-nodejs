'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserApp = sequelize.define('UserApp', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  UserApp.associate = function(models) {
    // associations can be defined here
  };
  return UserApp;
};