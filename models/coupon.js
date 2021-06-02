const Sequelize = require('sequelize');

module.exports = class Coupon extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            coupon_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            coupon_type: { // 1: X원 이상 구매시 Y원이 할인, 2: 특정 카테고리 상품 구매시, 할인 한도 Y원 내에서 X%가 할인되는 쿠폰
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            sale_price: {//1
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            sale_percent: {//2
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            sale_price_limit: {//2
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            sale_condition_price: { //1
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            sale_condition_cat: { //2
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'Coupon',
            tableName: 'coupon',
            paranoid: false, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
};