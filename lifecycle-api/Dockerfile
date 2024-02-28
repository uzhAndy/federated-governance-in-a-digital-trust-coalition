FROM python:3.11.7 as build
WORKDIR /app/api
RUN apt install libpq-dev
RUN pip install --no-cache-dir pipenv
# make sure to install dependencies from Pipfile.lock
COPY ./Pipfile.lock  /app/api/Pipfile.lock
COPY . .
RUN pipenv install --deploy --ignore-pipfile 
CMD ["pipenv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]

