const Sequelize = require('sequelize');

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
      descriprion: {
        type: Sequelize.STRING(100),
      },
      cat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      file: {
        type: Sequelize.STRING(100),
      },
      exist: {
        type: Sequelize.INTEGER,
      },
      regist_time: {
        type: Sequelize.DATE,
      }
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

  static associate(db) {}
};