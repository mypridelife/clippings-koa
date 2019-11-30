const Clipping = (sequelize, DataTypes) => sequelize.define('clipping', {
    id: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID',
    },
    bookName: {
        type: DataTypes.STRING(40),
        allowNull: false,
        comment: '书籍名称',
    },
    author: {
        type: DataTypes.STRING(40),
        allowNull: true,
        comment: '作者',
    },
    coverImage: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '书籍封面',
    },
    bookInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '书籍信息',
    },
    addTime: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '添加时间',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '内容',
    },
    location: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '位置',
    },
    classify: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '分类',
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '注释',
    },
    tag: {
        type: DataTypes.STRING(11),
        allowNull: true,
        comment: '标记',
    },
    favorite: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        comment: '喜欢',
    },
    status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: '状态',
    },
},
    {
        timestamps: true,
        comment: '用户标注表',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

export default Clipping;