from typing import List
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Sequence
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session, Mapped, mapped_column
from dotenv import load_dotenv
from models.tables.connection import Connection
import os
import datetime

load_dotenv()
CONTROLLER_DB_URL = os.getenv("CONTROLLER_DB_URL")

engine = create_engine(CONTROLLER_DB_URL)
Base = declarative_base()
Base.metadata.create_all(bind=engine)

class Credential(Base):
    __tablename__ = 'credential'
    __table_args__ = {'schema': 'controller_db'}
    id = Column(Integer, Sequence('credential_id_seq', schema='controller_db'), primary_key=True, index=True)
    created_at = Column(TIMESTAMP)
    modified_at = Column(TIMESTAMP)
    name = Column(String(36))
    value = Column(String(36))
    type = Column(String(64))
    thread_id = Column(String(36))
    credential_exchange_id = Column(String(36))
    is_valid = Column(Boolean)
    connection_id: Mapped[int] = mapped_column(Integer, ForeignKey(Connection.id))

    def __str__(self):
        return f"id: {self.id}, name: {self.name}, value: {self.value}, is_valid: {self.is_valid}, connection_id: {self.connection_id}, thread_id: {self.thread_id}, credential_exchange_id: {self.credential_exchange_id}"

def add_all(credentials: List[Credential]):
    session = Session(engine)
    session.add_all(credentials)
    session.commit()
    session.close()
    
def get_existing_attributes(conn_id) -> List[Credential]:
    session = Session(engine)
    credentials = session.query(Credential).filter_by(connection_id=conn_id).all()
    session.close()
    return credentials

def update_existing_attributes(conn_id, thread_id, cred_ex_id) -> List[Credential]:
    session = Session(engine)
    ex_creds_sess = session.query(Credential).filter_by(connection_id=conn_id, is_valid=True)
    thread_id = thread_id
    with session.begin():
        for cred in ex_creds_sess:
            cred.credential_exchange_id = cred_ex_id
            cred.thread_id = thread_id
    session.close()
    return "success", 200

def revoke_cred_ex(cred_ex_id: str):
    ret_arr = []
    session = Session(engine)
    ex_creds_sess = session.query(Credential).filter_by(credential_exchange_id=cred_ex_id)
    with session.begin():
        for cred in ex_creds_sess:
            cred.modified_at = datetime.datetime.now()
            cred.is_valid = False
    session.close()
    ret_arr = session.query(Credential).filter_by(credential_exchange_id=cred_ex_id).all()
    return ret_arr, 200