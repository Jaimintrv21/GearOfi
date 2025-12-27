import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Config
DB_USER = "postgres"
DB_PASS = "123456"
DB_HOST = "localhost"
DB_NAME = "gearguard_db"

def create_database():
    print(f"Connecting to Postgres to create '{DB_NAME}'...")
    try:
        # Connect to default 'postgres' database
        con = psycopg2.connect(
            dbname="postgres", 
            user=DB_USER, 
            password=DB_PASS, 
            host=DB_HOST
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Creating database {DB_NAME}...")
            cur.execute(f"CREATE DATABASE {DB_NAME}")
            print("Database created successfully!")
        else:
            print(f"Database {DB_NAME} already exists.")
            
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
