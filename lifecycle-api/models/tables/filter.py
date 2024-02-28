from sqlalchemy import Column, Integer, String, Sequence, create_engine
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
CONTROLLER_DB_URL = os.getenv("CONTROLLER_DB_URL")

engine = create_engine(CONTROLLER_DB_URL)
Base = declarative_base()
Base.metadata.create_all(bind=engine)



class Filter(Base):
    __tablename__ = 'filter'
    __table_args__ = {'schema': 'controller_db'}
    id = Column(Integer, Sequence('connection_id_seq'), primary_key=True, index=True)
    name = Column(String(32))
    cred_def_id = Column(String(256))
    issuer_did = Column(String(36))
    schema_id = Column(String(32))
    schema_name = Column(String(32))
    schema_version = Column(String(16))