import mysql.connector
import json

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "web_db"
}

def check_schema():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("DESCRIBE users")
        schema = cursor.fetchall()
        with open('schema_output.json', 'w') as f:
            json.dump(schema, f, indent=4)
        conn.close()
        print("Schema written to schema_output.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()
