FROM python:3.10-slim

# 安装 ImageMagick 和依赖
RUN apt-get update && apt-get install -y \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

# 修复 ImageMagick 的安全策略限制（防止 policy.xml 报错）
RUN sed -i 's/<policy domain="path" rights="none" pattern="@\*"/<!-- & -->/' /etc/ImageMagick-6/policy.xml || true

# 设置工作目录
WORKDIR /app

# 拷贝项目文件
COPY . .

# 安装 Python 依赖
RUN pip install --no-cache-dir flask

# 设置默认端口
ENV PORT=5080

# 暴露端口
EXPOSE 5080

# 启动应用
CMD ["python", "app.py"]