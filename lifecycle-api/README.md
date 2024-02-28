# TCA Credential Lifecycle API
This repository contains the FastAPI application `lifecycle-api` and is suggested to be built with [Pipenv](https://pipenv.pypa.io/en/latest/).
It exposes 13 endpoints to handle authentication, authorization, the status management of the issued AnonCreds verifiable credentials (VC) and partake in the governance of the Trust Coalition.

### Clone this Repository

Clone the repository and its submodules with:
```
$: git clone git@github.com:uzhAndy/fed-gov-ddos-data-mesh.git
```

## Run the Application
```bash
# change directory to this submodule
$: cd fed-gov-ddos-data-mesh/lifecycle-api
$: pipenv install
# run the application and reload when files are changed
$: pipenv run uvicorn main:app --reload
```

The application will be accessible at [localhost:8000](http://localhost:8000).

## Documentation

Documentation is automatically generated using Swagger UI at [/docs](http://127.0.0.1:8000/docs). The OpenAPI schema is available at [/openapi.json](http://127.0.0.1:8000/openapi.json)
