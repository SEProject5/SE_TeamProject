const Sequelize = require('sequelize');

//결제랑 관련
module.exports = class OrderDetail extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            order_detail_id: { //주문상세번호
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: { //주문번호
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            p_id: { //상품번호
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            p_name: {
                type: Sequelize.STRING(10),
                allowNull : false
            },
            p_price : {
                type : Sequelize.INTEGER,
                allowNull : false
            },
            order_quantity: {
                type: Sequelize.INTEGER,
                allowNull : false
            },

        }, {
            sequelize,
            timestamps: false, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'OrderDetail',
            tableName: 'order_detail',
            paranoid: false, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.OrderDetail.belongsTo(db.Order, { foreignKey: 'order_id', targetKey: 'order_id' });
        db.OrderDetail.belongsTo(db.Product, { foreignKey : 'p_id', targetKey : "p_id"});
    }
};