from fastapi import HTTPException, status, Request, Depends
from models.tables.user import UserRole, get_user_by_sub, register_user, get_user_by_fn_ln
import jwt
import datetime
from dotenv import load_dotenv
import os
load_dotenv()


SIGNATURE = os.getenv("JWT_SECRET_KEY")

def get_token(request: Request):
    return request.headers['Authorization']

def is_authorized(token: str = Depends(get_token)):
    print("DDDDDDDDDDDDDDDDDDDDDDDDDD")
    if validate_auth_token(token):
        return True;
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="unauthoized user",
            headers={"WWW-Authenticate": "Bearer"},
        )

def is_valid_token(iat: int, time: float):
    return time - iat < 60 * 60

def validate_auth_token(auth_token: str):
    try:
        decoded = jwt.decode(auth_token, SIGNATURE, algorithms="HS256")
        subject = decoded['sub']
        iat = decoded['iat']
        timestamp = datetime.datetime.now().timestamp()
        
        if(not is_valid_token(iat, timestamp)):
            return False
        user = get_user_by_sub(subject)
        if(user): 
            return True
        else:
            return False
    except jwt.DecodeError:
        return False

def validate_admin(sub):
    user = get_user_by_sub(sub=sub)
    if(user and user.role == UserRole.admin):
        body = {
            "sub": str(user.id),
            "iat": int(datetime.datetime.now().timestamp()),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": str(user.role),
        }
        return jwt.encode(payload=body, algorithm="HS256", key=SIGNATURE)
    else:
        return False

def validate_user(sub):
    user = get_user_by_sub(sub=sub)
    if(user):
        return True
    else: 
        return False
    
def register_admin():
    first_name = ""
    last_name = ""
    register_user(first_name=first_name, last_name=last_name, role=UserRole.ADMIN)

