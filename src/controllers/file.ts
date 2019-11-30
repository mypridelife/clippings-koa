import * as fs from 'fs';
import * as path from 'path';
import getClippings from '../utils/getClippings';
import statusCode from '../utils/statusCode';
import {
    createOne,
    updateStatus,
    findOne,
    findAll,
    findAllAndCount,
    countAll
} from '../services/FileService';
import { createClipping } from '../services/ClippingService';

export default class FileController {
    public static async analysisFile(ctx) {
        const reqData = ctx.request.body;

        const fileId = reqData.fileId;
        const userId = ctx.user.id;
        if (fileId) {
            try {
                const item = await findOne(fileId);
                if (!item) {
                    ctx.body = statusCode.SUCCESS('文件不存在');
                    return;
                }
                if (userId !== item.userId || item.status === -1) {
                    ctx.body = statusCode.SUCCESS('文件不存在');
                } else {
                    const filePath = `${path.join(__dirname, item.fileUrl)}`;
                    const clippingArr = getClippings(filePath);

                    for (let index = 0; index < clippingArr.length; index++) {
                        const element = clippingArr[index];
                        const clipping = {
                            userId: ctx.user.id,
                            fileId,
                            ...element
                        };
                        await createClipping(clipping);
                    }
                    ctx.body = statusCode.SUCCESS('解析成功');
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(
                    error.message || '解析失败：服务器内部错误！'
                );
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('解析失败: 参数错误');
        }
    }
    /**
     * 获取文件后缀名
     */
    public static extname(filename) {
        if (!filename || typeof filename != 'string') {
            return false;
        }
        const a = filename
            .split('')
            .reverse()
            .join('');
        const b = a
            .substring(0, a.search(/\./))
            .split('')
            .reverse()
            .join('');
        return b;
    }
    // 增
    public static async add(ctx) {
        try {
            const userId = ctx.user.id;

            const time1 = new Date().getTime();
            const { file } = ctx.request.files;
            const reader = fs.createReadStream(file.path);

            const suffix = FileController.extname(file.name);
            const size = file.size;
            const type = file.type;

            const filePath = `${path.join(
                __dirname,
                '../../assets/uploads/'
            )}/${userId}_${time1}.${suffix}`;
            // 创建可写流
            const upStream = fs.createWriteStream(filePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            fs.unlinkSync(file.path);
            const fileUrl = `../../assets/uploads/${userId}_${time1}.${suffix}`;

            const params = {
                userId,
                fileUrl,
                size,
                type
            };
            const newFile = await createOne(params);

            if (!newFile) {
                ctx.body = statusCode.ERROR_SQL('上传失败: 访问数据库异常！');
            }

            ctx.body = statusCode.SUCCESS('上传成功！', newFile);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM('上传失败: 服务器内部错误！');
        }
    }

    // 删
    public static async delete(ctx) {
        const reqData = ctx.request.body;
        const id = reqData.id;
        const userId = ctx.user.id;

        if (id) {
            try {
                const item = await findOne(id);

                if (userId !== item.userId || item.status === -1) {
                    ctx.body = statusCode.SUCCESS('标注不存在');
                } else {
                    await updateStatus(id, -1);
                    ctx.body = statusCode.SUCCESS('删除成功');
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(
                    error.message || '删除失败：服务器内部错误！'
                );
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('删除失败: 参数错误');
        }
    }
    // 查
    public static async find(ctx) {
        const reqData = ctx.request.body;
        const id = reqData.id;
        const userId = ctx.user.id;

        if (id) {
            try {
                const item = await findOne(id);

                if (userId !== item.userId || item.status === -1) {
                    ctx.body = statusCode.SUCCESS('文件不存在');
                } else {
                    ctx.body = statusCode.SUCCESS('查询成功', item);
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(
                    error.message || '查询失败：服务器内部错误！'
                );
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('查询失败: 参数错误');
        }
    }
    // 查
    public static async findAll(ctx) {
        const userId = ctx.user.id;

        try {
            const itemList = await findAll(userId);
            ctx.body = statusCode.SUCCESS('查询成功', itemList);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
    // 查询所有并分页
    public static async findAllAndCount(ctx) {
        const userId = ctx.user.id;
        const { currentPage = 1, count = 10 } = ctx.request.body;
        const offset = (currentPage - 1) * count;

        try {
            const [fileList, total] = await Promise.all([
                findAllAndCount(userId, parseInt(count), offset),
                countAll(userId)
            ]);
            const data = {
                currentPage,
                count,
                total,
                fileList
            };

            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
}
