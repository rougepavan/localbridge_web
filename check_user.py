import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "app_db"
}

def check_user(email):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, email, reset_otp FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()
        if user:
            print(f"User found: {user}")
        else:
            print(f"User {email} NOT found in database.")
    except Exception as e:
        print(f"DB ERROR: {e}")

if __name__ == "__main__":
    check_user("pavanofficial897@gmail.com")
