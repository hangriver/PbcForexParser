# 使用Node.js官方镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package*.json ./
RUN npm install

COPY . .

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "index.js"]
