import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "web_db"
}

def fix_schema():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check if 'name' exists
        cursor.execute("SHOW COLUMNS FROM users LIKE 'name'")
        has_name = cursor.fetchone()
        
        if not has_name:
            # Check if 'full_name' exists to rename it
            cursor.execute("SHOW COLUMNS FROM users LIKE 'full_name'")
            has_full_name = cursor.fetchone()
            if has_full_name:
                print("Renaming full_name to name...")
                cursor.execute("ALTER TABLE users CHANGE full_name name VARCHAR(100)")
            else:
                print("Adding name column...")
                cursor.execute("ALTER TABLE users ADD COLUMN name VARCHAR(100) AFTER id")
        
        conn.commit()
        conn.close()
        print("Schema fixed successfully")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_schema()
