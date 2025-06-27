# Use official Python 3.11.9 image
FROM python:3.11.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install OS-level dependencies
RUN apt-get update && apt-get install -y build-essential

# Copy entire project
COPY . .

# Change to service directory
WORKDIR /app/src/ml_models_service

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port your Flask app uses
EXPOSE 6000

# Start the application with gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:6000"]
