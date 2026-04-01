import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": ""
}

def list_databases():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES")
        dbs = cursor.fetchall()
        print(f"Databases: {dbs}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_databases()
