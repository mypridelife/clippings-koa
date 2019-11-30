const File = (sequelize, DataTypes) =>
  sequelize.define(
    'file',
    {
      id: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID'
      },
      fileUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '文件路径',
        unique: true
      },
      fileName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '文件名称',
        unique: true
      },
      size: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        comment: '文件大小'
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '文件类型'
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: '状态'
      }
    },
    {
      timestamps: true,
      comment: '用户文件表',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  );

export default File;
