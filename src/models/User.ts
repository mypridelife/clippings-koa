const User = (sequelize, DataTypes) => sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID',
    },
    profilePhoto: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '头像',
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // 唯一性约束
        validate: {
            customValidator() {
                if (this.name.length < 6 || this.name.length > 20) {
                    throw new Error('用户名须由字母或数字组成且长度为6-20位');
                }
            }
        },
        comment: '昵称',
    },
    realName: {
        type: DataTypes.STRING(12),
        allowNull: true,
        comment: '真实姓名',
    },
    mobile: {
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true, // 唯一性约束
        comment: '手机号',
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true, // 唯一性约束
        comment: '邮箱',
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '密码',
        validate: {
            customValidator() {
                if (this.password.length < 6 || this.password.length > 64) {
                    console.log(this.password);
                    console.log(this.password.length);

                    throw new Error('密码须由字母或数字组成且长度为6-20位');
                }
            }
        },
    },
    role: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        comment: '权限',
    },
    sex: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        comment: '性别',
    },
    birthday: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '年龄',
    },
    address: {
        type: DataTypes.STRING(40),
        allowNull: true,
        comment: '住址',
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
        comment: '用户表',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

export default User;