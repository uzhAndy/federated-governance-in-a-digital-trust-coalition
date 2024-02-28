from sqlalchemy import Column, Integer, String, Sequence, create_engine, inspect
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
CONTROLLER_DB_URL = os.getenv("CONTROLLER_DB_URL")

engine = create_engine(CONTROLLER_DB_URL)
Base = declarative_base()
Base.metadata.create_all(bind=engine)
class Connection(Base):
    __tablename__ = 'connection'
    __table_args__ = {'schema': 'controller_db'}
    id = Column(Integer, Sequence('connection_id_seq', schema="controller_db"), primary_key=True, index=True)
    connection_id = Column(String(36), nullable=False)
    comment = Column(String(256))

def get_connection(connection_id: str) -> Connection | None:
    session = Session(engine)
    connection = session.query(Connection).filter_by(connection_id=connection_id).first()
    return connection

def get_connections_from_list(connection_ids):
    session = Session(engine)
    connections = session.query(Connection).filter(Connection.connection_id.in_(connection_ids)).all()
    return connections

def add(conn: Connection):
    session = Session(engine)
    session.add(conn)
    session.commit()
    # TODO removal of print statement ends in error
    print("AAAAAAAAAAAAAAAAAA", conn.id)
    session.close()
    return conn.id