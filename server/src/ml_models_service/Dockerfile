# Use official Python 3.11.9 image
FROM python:3.11.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install OS-level dependencies
RUN apt-get update && apt-get install -y build-essential

# Copy project
COPY . .

# Change to ML service directory
WORKDIR /app/src/ml_models_service

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port used by Flask app
EXPOSE 10000

# Start using raw Python, not gunicorn (since it's a pure ML API)
CMD ["python", "app.py"]
