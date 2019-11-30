import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import * as bcrypt from 'bcryptjs';
import docrypt from '../utils/crypt';
import statusCode from '../utils/statusCode';

import {
    updateUserById,
    getUserById,
    createUser,
    getUserByName,
    updateUserPassword
} from '../services/UserService';

const verify = util.promisify(jwt.verify);

export default class UserController {
    // 登录
    public static async login(ctx) {
        const reqData = ctx.request.body;
        const { name, password } = reqData;

        if (name && password) {
            try {
                const userInfo = await getUserByName(name);
                if (!userInfo) {
                    ctx.body = statusCode.ERROR_EXISTED('用户不存在');
                } else {
                    const { id, name } = userInfo;
                    if (bcrypt.compareSync(password, userInfo.password)) {
                        const token: string = jwt.sign({ name, id }, 'jwtSecret', {
                            expiresIn: '24h'
                        });
                        ctx.body = statusCode.SUCCESS('登录成功', { token, userInfo });
                    } else {
                        //
                        ctx.body = statusCode.ERROR_LOGIN('登录失败：用户名或密码错误');
                    }
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM('登录失败：服务器内部错误！');
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('登录失败: 参数错误');
        }
    }
    // 注册
    public static async register(ctx) {
        const reqData = ctx.request.body;
        const { name, password } = reqData;

        if (name && password) {
            try {
                const userInfo = await getUserByName(name);
                if (userInfo) {
                    ctx.body = statusCode.ERROR_EXISTED('用户已经存在');
                } else {
                    reqData.password = docrypt(password);
                    if (!reqData.hasOwnProperty('role')) {
                        // 如果没有传入role，则默认为游客，后期管理员可以改变角色
                        reqData.role = 1;
                    }
                    const newUser = await createUser(reqData);
                    if (!newUser) {
                        ctx.body = statusCode.ERROR_SQL('创建失败: 访问数据库异常！');
                    } else {
                        const userInfo = await getUserByName(newUser.name);
                        const {
                            id,
                            name,
                        } = userInfo;

                        const token = jwt.sign({ name, id }, 'jwtSecret', {
                            expiresIn: '24h'
                        });

                        ctx.body = statusCode.SUCCESS('创建用户成功', { token, userInfo });
                    }
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(error.message || '创建失败：服务器内部错误！');
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('创建失败: 参数错误');
        }
    }

    // 根据id查询用户信息
    public static async getUserById(ctx) {
        const { id } = ctx.params;
        if (!id) {
            ctx.body = statusCode.ERROR_PARAMETER('查询失败: 参数错误');
        } else {
            try {
                const userInfo = await getUserById(id);

                ctx.body = statusCode.SUCCESS('查询成功', userInfo);
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM('查询失败：服务器内部错误！');
            }
        }
    }

    // 根据id修改用户信息
    public static async updateUserById(ctx) {
        const id = parseInt(ctx.params.id);
        const reqData: object = ctx.request.body;
        const userId = ctx.user.id;

        if (!id) {
            ctx.body = statusCode.ERROR_PARAMETER('更新失败: 参数错误');
        } else {
            try {
                if (userId !== id) {
                    ctx.body = statusCode.SUCCESS('更新失败：权限校验失败！');
                } else {
                    await updateUserById(id, reqData);
                    ctx.body = statusCode.SUCCESS('更新成功');
                }

            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM('更新失败：服务器内部错误！');
            }
        }
    }

    // 根据id修改密码
    public static async updateUserPassword(ctx) {
        const token = ctx.header.authorization;
        const data = ctx.request.body;
        const { id } = ctx.params;

        if (id) {
            try {
                const payload = await verify(token.split(' ')[1], 'jwtSecret');
                const userInfo = await getUserByName(payload.name);
                if (bcrypt.compareSync(data.oldPassword, userInfo.password)) {
                    const password = docrypt(data.password);
                    // 只更新密码时不传手机号码
                    await updateUserPassword(id, password);

                    ctx.body = statusCode.SUCCESS('修改成功');
                } else {
                    ctx.body = statusCode.ERROR_PARAMETER('原密码错误，请重新输入！');
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM('修改失败，服务器内部错误！');
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('有信息为空，请输入！');
        }
    }
}
