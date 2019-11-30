import { File, User } from '../models';
import sequelize from '../config/init-db';

// 增
const createOne = async (params: object) => File.create(params);

// 删
const updateStatus = async (id: number, status: number) => File.update(
    { status },
    { where: { id }, fields: ['status'] },
);

// 根据id查询标注信息
const findOne = async (id: number) => File.findOne({
    where: { id }
});
// 根据id查询标注信息
const findAll = async (userId: number) => {
    const user = new User();
    user.id = userId;
    return user.getFiles({
        where: {
            status: 1
        }
    });
};
const findAllAndCount = async (userId: number, count: number, offset: number) => {
    const user = new User();
    user.id = userId;
    return user.getFiles({
        order: [
            ['updatedAt', 'DESC']
        ],
        limit: count,
        offset,
        where: {
            status: 1
        }
    });
};

const countAll = async (userId: number) =>
    File.count({
        where: {
            userId,
            status: 1
        }
    });

export {
    createOne,
    updateStatus,
    findOne,
    findAll,
    findAllAndCount,
    countAll
};
