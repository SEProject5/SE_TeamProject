const Sequelize = require('sequelize');
const Product = require('./product');

module.exports = class Cart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            cartSeq: {
                type: Sequelize.STRING(20),
                primaryKey: true,
                autoIncrement: true,
            },
            userSeq: { //유저id
                type: Sequelize.INTEGER,
            },
            productSeq: { //상품id
                type: Sequelize.INTEGER,
                reference: {
                    model: Product,
                    key: 'p_id',
                }
            },
            productNum: { //갯수
                type: Sequelize.INTEGER,
            }
        }, {
            sequelize,
            timestamps: false, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'Cart',
            tableName: 'cart',
            paranoid: true, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_bin',
        });
    }

    static associate(db) {
        db.Cart.belongsTo(db.Product, { foreignKey: 'productSeq', targetKey: 'p_id' });
    }
};