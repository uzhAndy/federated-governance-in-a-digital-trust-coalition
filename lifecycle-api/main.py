import logging
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import agent_webhooks, authentication, lifecycle_events
from utils.web3 import test
import os

load_dotenv()
description = """
## Introduction
This API exposes 13 endpoints to handle authentication, authorization, the status management of the issued AnonCreds verifiable credentials (VC)
and partake in the governance of the Trust Coalition. The API is divided into five route categories; it needs to be reachable on port `8000`. To verify the route 
`/health` allows to check for a heartbeat by running the following bash command from the host machine:

```bash
$: curl http://localhost:8000/health
```
if you receive:
```bash
{"status":"healthy"}
```
the API is running and reachable from the host (*if you can read this documentation, then the API is reachable. However, if you're running 
the lifecycle API on a server, this page should not be reachable and checking the heartbeat mighthelp troubleshooting).* The host is marked with a
green border.

![Issuer Architecture Overview](http://127.0.0.1:8000/documentation/Architecture%20Overview%20-%20Issuer%20highlight-lifecycle-api.png)

## Routes
The remaining four routes are `auth`, `tc-membership-lifecycle`, `vc-lifecycle` and `agent-webhook (M2M)`.

| route | description |
| ----- | ----------- |
|[`/auth`](http://localhost:8000/docs#/auth)| check if uuid4 is user/admin of application and validate jwt access token |
|[`/tc-membership-lifecycle`](http://localhost:8000/docs#/tc-membership-lifecycle)| generate (mock) challenge for the accelerated joiner process |
|[`/vc-lifecycle`](http://localhost:8000/docs#/vc-lifecycle) | issue, retrieve and revoke VCs on behalf of ACApy |
|[`/agent-webhook (M2M)`](http://localhost:8000/docs#/agent-webhook%20(M2M))| monitor state changes form ACApy events - mainly used to prevent failing webhook requests from ACApy and minimize unnecessary retries |


"""

app = FastAPI(
    debug=True,
    title="lifecycle-api",
    description=description,
    summary="lifecycle API of the Trust Coaliton Agent (TCA), a prototype for a decentralized data-oriented software system for federated governance \
            based on decentralized identifiers (DID) and AnonCreds verifiable credentials.",
    version="1.0.0_alpha",
    contact={
        "name": "Andy Aidoo",
        "email": "andy.aidoo@uzh.ch",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
    )

origins = [
    "http://localhost",
    "http://localhost:4200", # angular dev port
    "http://localhost:9031" # controller docker port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)


@app.get(
        "/health",
        tags=["health"],
        summary="Heartbeat",
        description="returns `{'status': 'healthy'}` if the lifecycle-api is running and reachable.",
        )
async def read_root():
    # await test()
    return {"status": "healthy"}


app.include_router(authentication.router)
app.include_router(lifecycle_events.router)
app.include_router(agent_webhooks.router)

@app.get(
        "/documentation/{fname}",
        tags=["file-service"],
        summary="Returns the file in folder /documentation of the lifecycle-api"
        )
def read_image(fname):
    filepath = os.path.join('documentation/', os.path.basename(fname))
    print(filepath)
    # return fname
    return FileResponse(filepath)