import * as fs from 'fs';
import * as path from 'path';

import statusCode from '../utils/statusCode';

export default class BaseController {
    public static async uploadPhoto(ctx) {
        console.log(ctx);

        try {
            const { file } = ctx.request.files; // 获取上传文件
            const { rename } = ctx.request.body; // 获取微信小程序 传递的重命名
            file.name = rename;
            const reader = fs.createReadStream(file.path);
            const filePath = `${path.join(__dirname, '../../assets/uploads/')}/${file.name}`;
            // 创建可写流
            const upStream = fs.createWriteStream(filePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            fs.unlinkSync(file.path);
            const fileUrl = `http://localhost:8000/assets/uploads/${file.name}`;
            ctx.body = statusCode.SUCCESS('上传成功！', fileUrl);
        } catch (error) {
            ctx.response.status = 200;
            ctx.body = statusCode.ERROR_SYSTEM('查询失败: 服务器内部错误！');
        }
    }

    public static async getOptions(ctx) {
        try {
            const data = {
                roleOpts: [
                    { text: '超级管理员', value: 10 },
                    { text: '管理员', value: 2 },
                    { text: '用户', value: 1 },
                    { text: '游客', value: 0 },
                ],
                sexOpts: [
                    { text: '男', value: 0 },
                    { text: '女', value: 1 },
                ],
            };
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.response.status = 200;
            ctx.body = statusCode.ERROR_SYSTEM('查询失败: 服务器内部错误！');
        }
    }
}