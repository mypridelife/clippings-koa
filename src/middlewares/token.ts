import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import statusCode from '../utils/statusCode';

const verify = util.promisify(jwt.verify);

const token = () => async (ctx, next) => {
    try {
        const token = ctx.header.authorization;
        if (token) {
            const tk = token.split(' ')[1];
            try {
                const payload = await verify(tk, 'jwtSecret');
                ctx.user = {
                    name: payload.name,
                    id: payload.id,
                };
            } catch (error) {
                error.status = 200;
                ctx.body = statusCode.ERROR_AUTH('权限认证失败: 请重新登录！');
            }
        }
        await next();
    } catch (error) {
        if (error.status === 401) {
            ctx.status = 200;
            ctx.body = statusCode.ERROR_AUTH('权限认证失败: 请重新登录！');
        } else {
            error.status = 200;
            ctx.body = statusCode.ERROR_AUTH('权限认证失败: 请重新登录！');
        }
    }
};

export { token };