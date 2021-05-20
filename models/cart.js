const Sequelize = require('sequelize');

module.exports = class Cart extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        carSeq: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userSeq: {
            type: Sequelize.INTEGER,
        },
        productSeq: {
            type: Sequelize.INTEGER,
        },
        price: {
            type: Sequelize.INTEGER,
        },
        p_name: {
            type: Sequelize.STRING(45),
        },
        image: {
            type: Sequelize.STRING(45),
        },
        productNum: {
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

  static associate(db) {}
};