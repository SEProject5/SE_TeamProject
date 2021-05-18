const Sequelize = require('sequelize');

module.exports = class Order extends Sequelize.Model {
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
      order_date: { //주문날짜
        type: Sequelize.DATE,
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
      receiver_name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      receiver_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      order_state: { //결제완료, 배송중, 배송완료, 구매확정
        type: Sequelize.STRING(10),
      }
    }, {
      sequelize,
      timestamps: true, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'Order',
      tableName: 'order',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};