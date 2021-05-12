const Sequelize = require('sequelize');

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
      zip_code: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      addressDetail: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
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
      tableName: 'users',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};