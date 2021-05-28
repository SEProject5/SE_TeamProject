const Sequelize = require('sequelize');

module.exports = class Banner extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      banner_type: { //notice, event
        type: Sequelize.STRING(20),
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING(200),
      },
    }, {
      sequelize,
      timestamps: true, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'Banner',
      tableName: 'banner',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};