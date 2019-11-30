import { User } from '../models';

// 注册-创建用户
const createUser = async params => User.create(params);
// 根据id查询用户信息
const getUserById = async id => User.findOne({
    where: { id },
});
// 登录、注册-根据username查询用户
const getUserByName = async (name: string) => User.findOne({ where: { name } });

const getAndCountAllUser = async params => User.findAndCountAll({
    offset: params.offset,
    limit: params.limit,
});
// 根据id修改用户信息
const updateUserById = async (id: number, user: object) => User.update(
    user,
    { where: { id } },
);
// 更新密码
const updateUserPassword = async (id: number, password: string) => User.update(
    { password },
    { where: { id }, fields: ['password'] },
);

// 暂时未用到
const getAllUser = async () => User.findAll();

export {
    createUser,
    getUserByName,
    getUserById,
    getAllUser,
    getAndCountAllUser,
    updateUserById,
    updateUserPassword,
};
