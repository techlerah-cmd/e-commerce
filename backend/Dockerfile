FROM python:3.12-slim

# Set working directory to /app
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project into /app
COPY . .


# Set PYTHONPATH to /app
ENV PYTHONPATH=/app

# Run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
