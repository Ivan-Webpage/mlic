# 指定base
FROM python:alpine

# 設定工作目錄
WORKDIR /app

# 先複製環境套件來安裝，節省之後的打包時間
COPY requirements.txt .

# 環境安裝
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt


# 複製完整檔案
COPY . .

RUN python manage.py migrate && python manage.py makemigrations && python manage.py collectstatic

EXPOSE 8080

VOLUME ["db.sqlite3"]

# 啟動命令 gunicorn backend.wsgi:application --bind 0.0.0.0:8080
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8080"]