FROM python:3.10-slim

WORKDIR /app

# 安装 ImageMagick
RUN apt-get update && apt-get install -y imagemagick && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir flask

RUN mkdir -p uploads static/uploads output

EXPOSE 5080

CMD ["python", "app.py"]