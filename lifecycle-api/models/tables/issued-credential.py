from sqlalchemy import Column, Integer, Sequence, Boolean, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
CONTROLLER_DB_URL = os.getenv("CONTROLLER_DB_URL")

engine = create_engine(CONTROLLER_DB_URL)
Base = declarative_base()
Base.metadata.create_all(bind=engine)

class IssuedCredential(Base):
    __tablename__ = 'issued_credential'
    __table_args__ = {'schema': 'controller_db'}
    
    id = Column(Integer, Sequence('connection_id_seq'), primary_key=True, index=True)
    revoked = Column(Boolean, default=False)
    connection_id = Column(Integer, ForeignKey('connection.id'))
    credential_id = Column(Integer, ForeignKey('credential.id'))

def add():
    pass