const Sequelize = require('sequelize');

module.exports = class QnA extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            comment_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            comment: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            qna_id: {
                type: Sequelize.INTEGER,
                default: false,
            },
        }, {
            sequelize,
            timestamps: true, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'Comment',
            tableName: 'comment',
            paranoid: true, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
};