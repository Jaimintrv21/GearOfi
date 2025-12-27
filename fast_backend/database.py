from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to local postgres. Override with env var if needed.
# Format: postgresql://user:password@host/dbname
# SQLALCHEMY_DATABASE_URL = os.getenv(
#     "DATABASE_URL", 
#     "postgresql://postgres:123456@localhost:5432/gearguard_db"
# )

# Default to local postgres. Override with env var if needed.
# Format: postgresql://user:password@host/dbname
# SQLALCHEMY_DATABASE_URL = os.getenv(
#     "DATABASE_URL", 
#     "postgresql://postgres:123456@localhost:5432/gearguard_db"
# )

# Fallback to SQLite (as per README 'in-memory' promise or just for easy local dev)
SQLALCHEMY_DATABASE_URL = "sqlite:///./gearguard_v2.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
