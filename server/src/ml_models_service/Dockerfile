# Use official Python 3.11.9 image
FROM python:3.11.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY . .

WORKDIR /app/src/ml_models_service

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["python", "app.py"]
