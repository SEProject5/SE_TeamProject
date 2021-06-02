const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            review_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            recomend: { //0:적극 추천, 1: 추천, 2:비추천
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            delivery: { //0:매우 만족, 1: 만족, 2:불만족
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            score: { //0점 - 5점
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'Review',
            tableName: 'review',
            paranoid: true, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
};