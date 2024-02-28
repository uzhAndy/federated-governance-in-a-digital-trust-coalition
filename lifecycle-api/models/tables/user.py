from __future__ import print_function
from sqlalchemy import create_engine, Column, String, Enum, text
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from dotenv import load_dotenv
import enum
import os

load_dotenv()
CONTROLLER_DB_URL = os.getenv("CONTROLLER_DB_URL")

engine = create_engine(CONTROLLER_DB_URL)
Base = declarative_base()
Base.metadata.create_all(bind=engine)    
    
class UserRole(enum.Enum):
    admin = "admin"
    operator = "operator"

class User(Base):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'controller_db'}
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    first_name = Column(String(36))
    last_name = Column(String(36))
    role = Column(Enum(UserRole))

def get_user_by_sub(sub: str):
    session = Session(engine)
    return session.query(User).filter_by(id=sub).first()

def get_user_by_fn_ln(first_name: str, last_name):
    session = Session(engine)
    return session.query(User).filter_by(first_name=first_name, last_name=last_name).first()


def register_user(first_name: str, last_name: str, role: UserRole):
    new_admin = User(id=uuid4(), first_name=first_name, last_name=last_name, role=role)
    session = Session(engine)
    session.add(new_admin)
    session.commit()
    session.close()
