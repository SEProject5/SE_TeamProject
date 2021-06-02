const Sequelize = require('sequelize');
const Cart = require('./cart');

module.exports = class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      p_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      p_name: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      categoryName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING(1000),
      },
      /*file1: {
        type: Sequelize.STRING(1000),
      },
      file2: {
        type: Sequelize.STRING(1000),
      },
      file3: {
        type: Sequelize.STRING(1000),
      },*/
      delivery_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      exist: {
        type: Sequelize.INTEGER,
      },
    }, {
      sequelize,
      timestamps: true, //createdAt, updatedAt 생성
      underscored: false,
      modelName: 'Product',
      tableName: 'product',
      paranoid: true, //deletedAt 생성
      charset: 'utf8',
      collate: 'utf8_bin',
    });
  }

  static associate(db) {
      db.Product.hasMany(db.Cart, { foreignKey: 'productSeq', sourceKey: 'p_id' });
      //db.Product.hasMany(db.Cart, { foreignKey: 'productSeq', sourceKey: 'p_id' });
      db.Product.hasMany(db.OrderDetail, { foreignKey: 'p_id', sourceKey: 'p_id' });
  }
};