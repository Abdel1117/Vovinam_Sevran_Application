FROM python:3.11-alpine AS base

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 4000

FROM base AS dev

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "4000"]

FROM base AS prod

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]