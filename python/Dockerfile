FROM python:3.13

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source
COPY . .

EXPOSE 8002

CMD ["python", "app.py"]