import psycopg2
import psycopg2
# from prettytable import PrettyTable # Removed to avoid dependency
# Or just print simply if we don't want extra deps. Let's stick to simple printing.

DB_USER = "postgres"
DB_PASS = "123456"
DB_HOST = "localhost"
DB_NAME = "gearguard_db"

def check_data():
    print(f"--- Inspecting Database: {DB_NAME} ---")
    try:
        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
        cur = conn.cursor()

        # 1. List Tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        print(f"\nFound {len(tables)} tables:")
        for t in tables:
            print(f"- {t[0]}")

        # 2. Count Rows and Show Data
        for t in tables:
            table = t[0]
            print(f"\n[Table: {table}]")
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            count = cur.fetchone()[0]
            print(f"Total Rows: {count}")
            
            if count > 0:
                cur.execute(f"SELECT * FROM {table} LIMIT 3")
                rows = cur.fetchall()
                # Get column names
                colnames = [desc[0] for desc in cur.description]
                print(f"Columns: {colnames}")
                for row in rows:
                    print(row)
            else:
                print("(Table is empty)")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_data()
