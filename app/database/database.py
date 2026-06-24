
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config import settings

engine = create_engine(
    url=settings.DATABASE_URL_PSYCOPG,
    echo=False,
    pool_size=5,
    max_overflow=5,
)
session_factory = sessionmaker(engine)

class Base(DeclarativeBase):
    pass

def init_db(drop_all: bool = False) -> None:
    """
    Initialize database schema.
    Args:
        drop_all: If True, drops all tables before creation
    """
    if drop_all:
        Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)