import { User } from '../models';
import sequelize from '../config/init-db';

// 注册-创建用户
const createUser = async params => User.create(params);
// 根据id查询用户信息
const getUserById = async id =>
  User.findOne({
    where: { id }
  });
// 注册-查询用户是否存在
const getUserExitsByName = async (val: string) => {
  const sql = `SELECT * FROM users where name = ? LIMIT 1`;

  const userInfo = sequelize.query(sql, {
    replacements: [val],
    type: sequelize.QueryTypes.SELECT
  });

  return userInfo;
};
// 注册-查询用户邮箱是否存在
const getUserExitsByEmail = async (val: string) => {
  const sql = `SELECT * FROM users where email = ? LIMIT 1`;

  const userInfo = sequelize.query(sql, {
    replacements: [val],
    type: sequelize.QueryTypes.SELECT
  });

  return userInfo;
};
// 根据username/email查询用户
const getUserInfo = async (val: string) => {
  console.log(val);

  const sql = `SELECT * FROM users where (name = ? OR email = ?) and status=1 LIMIT 1`;

  console.log(sql);

  const userInfo = sequelize.query(sql, {
    replacements: [val, val],
    type: sequelize.QueryTypes.SELECT
  });

  return userInfo;
};
const getAndCountAllUser = async params =>
  User.findAndCountAll({
    offset: params.offset,
    limit: params.limit
  });
// 根据id修改用户信息
const updateUserById = async (id: number, user: object) =>
  User.update(user, { where: { id } });
// 更新密码
const updateUserPassword = async (id: number, password: string) =>
  User.update({ password }, { where: { id }, fields: ['password'] });

const deleteOne = async (id: number) =>
  User.destroy({
    where: {
      id
    }
  });

// 暂时未用到
const getAllUser = async () => User.findAll();

export {
  createUser,
  getUserInfo,
  getUserExitsByName,
  getUserExitsByEmail,
  getUserById,
  getAllUser,
  getAndCountAllUser,
  updateUserById,
  updateUserPassword,
  deleteOne
};
