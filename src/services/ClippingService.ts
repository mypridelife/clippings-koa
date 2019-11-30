import { Clipping, User } from '../models';
import sequelize from '../config/init-db';

// 增加一条标注
const createClipping = async (params: object) => Clipping.create(params);

// 删
const deleteClipping = async (id: number, status: number) =>
    Clipping.update({ status }, { where: { id }, fields: ['status'] });
// 改
const updateClipping = async (id: number, clipping: object) =>
    Clipping.update(clipping, { where: { id } });

// 根据id查询标注信息
const getClippingById = async (id: number) =>
    Clipping.findOne({
        where: { id }
    });

const findAllAndCount = async (
    userId: number,
    count: number,
    offset: number
) => {
    const user = new User();
    user.id = userId;
    return user.getClippings({
        limit: count,
        offset,
        where: {
            status: 1
        }
    });
};

const countAll = async (userId: number) =>
    Clipping.count({
        where: {
            userId,
            status: 1
        }
    });
const findAllFavorite = async (
    userId: number,
    count: number,
    offset: number
) => {
    const user = new User();
    user.id = userId;
    return user.getClippings({
        limit: count,
        offset,
        where: {
            status: 1,
            favorite: 1
        }
    });
};

const countAllFavorite = async (userId: number) =>
    Clipping.count({
        where: {
            userId,
            status: 1,
            favorite: 1
        }
    });

// 按照书名查询
const findAllClippingsByBook = async (
    userId: number,
    count: number,
    offset: number,
    bookName: String
) => {
    const user = new User();
    user.id = userId;
    return user.getClippings({
        limit: count,
        offset,
        where: {
            status: 1,
            bookName
        }
    });
};

const countAllClippingsBybook = async (userId: number, bookName: String) =>
    Clipping.count({
        where: {
            userId,
            status: 1,
            bookName,
        }
    });
const findAllBook = async (userId: number) => {
    const bookNameList = sequelize.query(`SELECT bookName, count(bookName) as count FROM clippings where userId=${userId} and status=1 group by bookName `, { type: sequelize.QueryTypes.SELECT });
    return bookNameList;
};

// 模糊搜索，名称，作者，内容
const searchNorAorC = async (
    userId: number,
    count: number,
    search: string, ) => {
    const baseList = sequelize.query(`SELECT *  FROM clippings where content like "%${search}%" and status= 1 and userId = ${userId} limit ${count} `, { type: sequelize.QueryTypes.SELECT });
    return baseList;
};


export {
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
    searchNorAorC,
};
