// import * as Sequelize from 'sequelize';
const Sequelize = require('sequelize');
const CryptoJS = require('crypto-js');
const key = require('/www/kindle-key.js');

const encryptText =
  'U2FsdGVkX1+ZlKwtn8vQUd9OeQ3uVx+OKzyXg38hwG7dP2km/4kGTDYvRmJzi9eD';
const bytes = CryptoJS.AES.decrypt(encryptText, key);
const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

const sequelize = new Sequelize('xjbq', 'xjbqName', originalPassword, {
  host: '106.75.169.146',
  port: '43963',
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_general_ci',
    },
    timestamps: true,
  },
  sync: { force: false },
  pool: { max: 5, min: 0, idle: 10000 },
});

export default sequelize;
