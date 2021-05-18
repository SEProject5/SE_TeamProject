const Sequelize = require('sequelize');

module.exports = class OrderDetail extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_number: { //주문번호
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        product_number: { //상품번호
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        product_count: { //상품수량
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        product_price: { //상품가격
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
      sequelize,
      timestamps: true, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'OrderDetail',
      tableName: 'order_detail',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};