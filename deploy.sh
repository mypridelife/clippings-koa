cd /var/lib/jenkins/workspace/clippings-server
node -v #检测node版本（此条命令非必要）
npm -v #检测npm版本（此条命令非必要）

npm install #安装项目中的依赖
npm run build #打包

nohup npm start > nohup.log 2>&1 &