import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "web_db"
}

def migrate_categories():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Mapping of old category names to new ones
        mapping = {
            "Functional Food": "Food",
            "Functional Powders": "Powders",
            "Functional Spices": "Spices",
            "Functional Liquids": "Liquids",
            "Functional Others": "Others"
        }
        
        for old, new in mapping.items():
            print(f"Updating '{old}' to '{new}'...")
            cursor.execute("UPDATE products SET category = %s WHERE category = %s", (new, old))
        
        # Also handle any case variations just in case
        cursor.execute("UPDATE products SET category = REPLACE(category, 'Functional ', '') WHERE category LIKE 'Functional %'")
        cursor.execute("UPDATE products SET category = REPLACE(category, 'functional ', '') WHERE category LIKE 'functional %'")

        conn.commit()
        print("Category migration completed successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"MIGRATION ERROR: {e}")

if __name__ == "__main__":
    migrate_categories()
