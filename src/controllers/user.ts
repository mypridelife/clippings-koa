import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import * as bcrypt from 'bcryptjs';
import docrypt from '../utils/crypt';
import statusCode from '../utils/statusCode';

import {
  updateUserById,
  getUserById,
  createUser,
  getUserInfo,
  updateUserPassword,
  getUserExitsByName,
  getUserExitsByEmail,
  deleteOne
} from '../services/UserService';
import sendRegisterEmail from '../utils/sendRegisterEmail';

const verify = util.promisify(jwt.verify);

export default class UserController {
  // 登录
  public static async login(ctx) {
    const reqData = ctx.request.body;
    const { name, password } = reqData;

    if (name && password) {
      try {
        const [userInfo] = await getUserInfo(name);
        if (!userInfo) {
          ctx.body = statusCode.ERROR_NOT_EXISTED('用户不存在');
        } else {
          const { id, name } = userInfo;
          if (bcrypt.compareSync(password, userInfo.password)) {
            const token: string = jwt.sign({ name, id }, 'jwtSecret', {
              expiresIn: '24h'
            });
            ctx.body = statusCode.SUCCESS('登录成功', { token, userInfo });
          } else {
            ctx.body = statusCode.ERROR_LOGIN('登录失败：用户名或密码错误');
          }
        }
      } catch (error) {
        ctx.body = statusCode.ERROR_SYSTEM(
          `登录失败：服务器内部错误！${error}`
        );
      }
    } else {
      ctx.body = statusCode.ERROR_PARAMETER('登录失败: 参数错误');
    }
  }
  // 注册
  public static async register(ctx) {
    const reqData = ctx.request.body;
    const { name, email, password } = reqData;

    if (name && email && password) {
      try {
        const [[userInfo], [userInfo2]] = await Promise.all([
          getUserExitsByName(name),
          getUserExitsByEmail(email)
        ]);
        if (userInfo || userInfo2) {
          if (userInfo) {
            ctx.body = statusCode.ERROR_EXISTED('该用户名已经注册');
          } else {
            ctx.body = statusCode.ERROR_EXISTED('该邮箱已被注册');
          }
        } else {
          reqData.password = docrypt(password);
          if (!reqData.hasOwnProperty('role')) {
            reqData.role = 1;
          }
          const newUser = await createUser(reqData);

          if (!newUser) {
            ctx.body = statusCode.ERROR_SQL('创建失败: 访问数据库异常！');
          } else {
            const { id, name } = newUser;

            const token = jwt.sign({ name, id }, 'jwtSecret', {
              expiresIn: '24h'
            });

            try {
              await sendRegisterEmail(token, email);
              ctx.body = statusCode.SUCCESS('注册成功，请先登录邮箱激活');
            } catch (error) {
              await deleteOne(id);
              ctx.body = statusCode.ERROR_SYSTEM(
                `注册失败，邮件发送失败,${error}`
              );
            }
          }
        }
      } catch (error) {
        ctx.body = statusCode.ERROR_SYSTEM(
          `创建失败：服务器内部错误！${error}`
        );
      }
    } else {
      ctx.body = statusCode.ERROR_PARAMETER('创建失败: 参数错误');
    }
  }

  // 激活
  public static async userActivation(ctx) {
    const code = ctx.query.code;

    if (code) {
      const tk = code;
      try {
        const payload = await verify(tk, 'jwtSecret');

        const { status } = await getUserById(payload.id);
        if (status === 1) {
          ctx.body = statusCode.SUCCESS('账号已激活');
          return;
        } else if (status === -1) {
          ctx.body = statusCode.ERROR_NOT_EXISTED('账号不存在');
          return;
        }

        await updateUserById(payload.id, { status: 1 });
        ctx.body = statusCode.SUCCESS('激活成功');
      } catch (error) {
        `激活失败：服务器内部错误！${error}`;
      }
    } else {
      ctx.body = statusCode.ERROR_PARAMETER('激活失败,参数缺失');
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
        const [userInfo] = await getUserInfo(payload.name);
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
