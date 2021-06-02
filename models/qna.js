const Sequelize = require('sequelize');

module.exports = class QnA extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            qna_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            contents: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            isAnswer: {
                type: Sequelize.BOOLEAN,
                default: false,
            },
        }, {
            sequelize,
            timestamps: true, //createdAt, updatedAt 생성
            underscored: false,
            modelName: 'QnA',
            tableName: 'qna',
            paranoid: true, //deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
};