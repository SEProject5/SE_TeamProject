const Sequelize = require('sequelize');

module.exports = class DeliverAddress extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        address_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        receiver_phone: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
        zip_code: {
          type: Sequelize.STRING(7),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        address_detail: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        address_type: { //기본 배송지: 0, 아니면:1
          type: Sequelize.INTEGER,
          allowNull: false,
        }
    }, {
      sequelize,
      timestamps: false, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'DeliverAddress',
      tableName: 'deliver_address',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};