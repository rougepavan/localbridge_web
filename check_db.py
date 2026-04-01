import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "app_db"
}

def check_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT count(*) as count FROM users")
        user_count = cursor.fetchone()['count']
        print(f"Total Users: {user_count}")
        
        cursor.execute("SELECT count(*) as count FROM products")
        product_count = cursor.fetchone()['count']
        print(f"Total Products: {product_count}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"Tables: {tables}")
        
        conn.close()
    except Exception as e:
        print(f"Database Error: {e}")

if __name__ == "__main__":
    check_db()
