# clippings-server

## 前端

[项目链接](https://github.com/mypridelife/clippings-vue): https://github.com/mypridelife/clippings-vue

## start

- 下载源码
  ```
  git clone
  ```
- 安装项目有关依赖
  ```
  npm i
  ```
- 创建 ybkj 数据库
  ```
  create database xjbq;
  ```
- 启动项目
  ```
  npm start
  ```

## 各目录及文件功能

- ├── README.md 介绍项目的有关情况
- ├── assets 放项目的静态资源
- │   └── uploads 这里放的用户上传的头像图片
- ├── launch.json vscode 编辑结合 ts 配置文件
- ├── node_modules 项目用到第三方依赖
- ├── package-lock.json npm 借鉴 yarn 而在 npm 5 引入的锁定依赖版本的配置文件
- ├── package.json 项目有关依赖、运行脚本
- ├── src 项目我们实际写主要的代码
- │   ├── app.js 入口文件，启动服务器、监听端口，引入各种中间件
- │   ├── config 项目的数据库等得配置文件
- │   ├── controllers 控制器，对各种请求进行处理，面向逻辑
- │   ├── middlewares 中间件，本地我们自己写得完善整个项目的功能
- │   ├── models 定义各种数据的表格，定义数据
- │   ├── routes 各种 url 对应的路由，于控制器的处理函数一一对应
- │   ├── services 定义各种操作数据库的方法，操作数据
- │   └── utils 定义各种工具函数
- └── .gitignore 配置 git 提交忽略的目录或文件
