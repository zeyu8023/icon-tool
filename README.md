# 🖼️ Icon Tool

一个基于 Flask 和 ImageMagick 的图标处理工具，支持批量上传图片、自动裁剪、居中填充、背景透明或白色，并生成统一尺寸的图标（256x256）。

## 🚀 功能特性

- ✅ 支持 PNG、JPG、JPEG、WEBP 格式上传
- ✅ 自动裁剪并居中填充为 256x256 尺寸
- ✅ 可选背景色（透明或白色）
- ✅ 批量上传、批量处理
- ✅ 下载处理后的图标文件

## 🖥️ 在线演示

> 本地部署后访问：`http://localhost:5080`

## 📦 快速开始

### 使用 Docker（推荐）

```bash
git clone https://github.com/zeyu8023/icon-tool.git
cd icon-tool
docker build -t icon-tool .
docker run -d -p 5080:5080 --name icon-tool icon-tool
```

### 使用 Docker Compose

```bash
docker-compose up -d --build
```

#### 示例 `docker-compose.yml`

```yaml
version: '3.8'

services:
  icon-tool:
    build: .
    container_name: icon-tool
    ports:
      - "5080:5080"
    environment:
      - PORT=5080
    volumes:
      - ./uploads:/app/uploads
      - ./output:/app/output
      - ./static/uploads:/app/static/uploads
    restart: unless-stopped
```

### 本地运行（开发模式）

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

访问：`http://localhost:5080`

## 🛠️ 项目结构

```
icon-tool/
├── app.py                  # Flask 主程序
├── Dockerfile              # Docker 构建文件
├── docker-compose.yml      # Docker Compose 配置
├── static/                 # 静态资源（样式、脚本、预览图）
│   └── uploads/            # 上传图像预览目录
├── templates/
│   └── index.html          # 前端页面模板
├── uploads/                # 原始上传文件
├── output/                 # 处理后的图标文件
```

## 🧰 技术栈

- Python 3.10
- Flask
- ImageMagick 6（使用 `convert` 命令）
- Docker / Docker Compose

## 📄 License

MIT License © [zeyu8023](https://github.com/zeyu8023)
