from fastapi import APIRouter, Request, Response
import logging
from models.api.auth import AuthenticateUserIdRequest
from utils.auth import validate_admin, validate_user, validate_auth_token

router = APIRouter()

@router.post(
        "/auth/is-user",
        tags=["auth"],
        summary="Authenticate and authorize a user id",
        description="Authenticates the user id by checking if it exists in the table *controller_db.user*"
        )
async def validate_sub(body: AuthenticateUserIdRequest, response: Response):
    sub = body.sub
    admin = body.admin
    logging.info(f"Received Login Request for {sub} with role {'admin' if admin else 'operator'}")
    if admin:
        ret_value = validate_admin(sub)
        if(ret_value):
            logging.info(f"Successful login. Issuing authentication token: {ret_value}")
        else:
            logging.info("Login unsucessful.")
        return ret_value
    else:
        return validate_user(sub)




@router.post(
        "/auth/user",
        tags=["auth"],
        summary="Validate JWT",
        description="Validates if a valid JWT has been added to the *Authorization* header"
        )
def authenticate_user(request: Request, response: Response):
    try:
        auth_token = request.headers['Authorization']
        return validate_auth_token(auth_token)
        
    except KeyError:
        return False