import statusCode from '../utils/statusCode';

import {
    createClipping,
    deleteClipping,
    updateClipping,
    getClippingById,
    findAllAndCount,
    countAll,
    findAllFavorite,
    countAllFavorite,
    findAllClippingsByBook,
    countAllClippingsBybook,
    findAllBook,
    searchNorAorC
} from '../services/ClippingService';

export default class ClippingController {
    // 增
    public static async add(ctx) {
        const reqData = ctx.request.body;
        const { bookName, author, content, location } = reqData;

        if (reqData) {
            try {
                // 3、插入一条标注
                const clipping = {
                    userId: ctx.user.id,
                    bookName,
                    author,
                    content,
                    location
                };
                const newClipping = await createClipping(clipping);
                console.log('已创建新的标注', newClipping);

                if (!newClipping) {
                    ctx.body = statusCode.ERROR_SQL('创建用户书籍失败: 访问数据库异常！');
                }

                // const obj = await getUserBookClippingById(newUserBookClipping.id);
                ctx.body = statusCode.SUCCESS('插入成功', newClipping);
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(
                    error.message || '创建失败：服务器内部错误！'
                );
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('创建失败: 参数错误');
        }
    }

    // 删
    public static async delete(ctx) {
        const reqData = ctx.request.body;
        const id = reqData.id;
        const userId = ctx.user.id;

        if (id) {
            try {
                const clipping = await getClippingById(id);

                if (userId !== clipping.userId || clipping.status === -1) {
                    ctx.body = statusCode.ERROR_PARAMETER('标注不存在');
                } else {
                    await deleteClipping(id, -1);
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
    // 改
    public static async update(ctx) {
        const reqData = ctx.request.body;
        const id = reqData.id;
        const userId = ctx.user.id;

        if (id) {
            try {
                const clipping = await getClippingById(id);
                if (userId !== clipping.userId || clipping.status === -1) {
                    ctx.body = statusCode.SUCCESS('标注不存在');
                } else {
                    await updateClipping(id, reqData);
                    ctx.body = statusCode.SUCCESS('更新成功');
                }
            } catch (error) {
                ctx.body = statusCode.ERROR_SYSTEM(
                    error.message || '创建失败：服务器内部错误！'
                );
            }
        } else {
            ctx.body = statusCode.ERROR_PARAMETER('创建失败: 参数错误');
        }
    }
    // 查
    public static async find(ctx) {
        const reqData = ctx.request.body;
        const id = reqData.id;
        const userId = ctx.user.id;

        if (id) {
            try {
                const clipping = await getClippingById(id);

                if (userId !== clipping.userId || clipping.status === -1) {
                    ctx.body = statusCode.SUCCESS('标注不存在');
                } else {
                    const clippingList = [clipping];
                    const data = {
                        currentPage: 1,
                        count: 10,
                        total: 1,
                        clippingList
                    };

                    ctx.body = statusCode.SUCCESS('查询成功', data);
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
    // 查询所有并分页
    public static async findAllAndCount(ctx) {
        const userId = ctx.user.id;
        const { currentPage = 1, count = 10 } = ctx.request.body;
        const offset = (currentPage - 1) * count;

        try {
            const [clippingList, total] = await Promise.all([
                findAllAndCount(userId, parseInt(count), offset),
                countAll(userId)
            ]);
            const data = {
                currentPage,
                count,
                total,
                clippingList
            };

            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
    // 查询所有喜欢
    public static async findAllFavorite(ctx) {
        const userId = ctx.user.id;
        const { currentPage = 1, count = 10 } = ctx.request.body;
        const offset = (currentPage - 1) * count;

        try {
            const [favoriteList, total] = await Promise.all([
                findAllFavorite(userId, parseInt(count), offset),
                countAllFavorite(userId)
            ]);
            const data = {
                currentPage,
                count,
                total,
                favoriteList
            };

            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
    // 按照书名查询
    public static async findAllClippingsByBook(ctx) {
        const userId = ctx.user.id;
        const { currentPage = 1, count = 10, bookName } = ctx.request.body;
        const offset = (currentPage - 1) * count;

        if (!bookName) {
            ctx.body = statusCode.ERROR_PARAMETER(
                '查询失败：参数错误！'
            );
            return;
        }
        try {
            const [baseList, total] = await Promise.all([
                findAllClippingsByBook(userId, parseInt(count), offset, bookName),
                countAllClippingsBybook(userId, bookName)
            ]);
            const data = {
                currentPage,
                count,
                total,
                baseList
            };

            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
    // 查询所有书名
    public static async findAllBook(ctx) {
        const userId = ctx.user.id;
        try {
            const [baseList, count] = await Promise.all([
                findAllBook(userId),
                countAll(userId)
            ]);
            const all = {
                bookName: '全部',
                count: count
            };
            baseList.unshift(all);
            ctx.body = statusCode.SUCCESS('查询成功', { baseList });
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
    // 模糊查询
    public static async searchNorAorC(ctx) {
        const userId = ctx.user.id;
        const { search } = ctx.request.body;
        const count = 10;

        if (!search) {
            ctx.body = statusCode.ERROR_PARAMETER(
                '查询失败：参数错误！'
            );
            return;
        }
        try {
            const baseList = await searchNorAorC(userId, count, search);
            const data = {
                baseList
            };

            ctx.body = statusCode.SUCCESS('查询成功', data);
        } catch (error) {
            ctx.body = statusCode.ERROR_SYSTEM(
                error.message || '查询失败：服务器内部错误！'
            );
        }
    }
}
