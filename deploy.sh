node -v #检测node版本（此条命令非必要）
npm -v #检测npm版本（此条命令非必要）

npm install #安装项目中的依赖
npm run build #打包

cd dist

pm2 start app.js
pm2 restart app