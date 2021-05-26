const Sequelize = require('sequelize');
const { destroy, hasMany } = require('./banner');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      user_type: {
        type: Sequelize.STRING(10), //normal, admin, domain
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'User',
      tableName: 'user',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_bin',
    });
  }

  static associate(db) {

  }
};