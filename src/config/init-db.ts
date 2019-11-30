// import * as Sequelize from 'sequelize';
const Sequelize = require('sequelize');

const sequelize = new Sequelize('xjbq', 'root', 'Mysql000000', {
    host: '97.64.43.124',
    dialect: 'mysql',
    logging: false,
    define: {
        underscored: false,
        freezeTableName: false,
        charset: 'utf8mb4',
        dialectOptions: {
            collate: 'utf8mb4_general_ci'
        },
        timestamps: true
    },
    sync: { force: false },
    pool: { max: 5, min: 0, idle: 10000 }
});

export default sequelize;
