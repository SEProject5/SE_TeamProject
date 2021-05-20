const Sequelize = require('sequelize');

//결제랑 관련
module.exports = class Order extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        id: { //주문상세번호
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