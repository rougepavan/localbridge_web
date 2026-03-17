import json
from app import app, get_db_connection, generate_ai_insight

def debug_products():
    print("--- DB RAW CHECK ---")
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products")
        raw_products = cursor.fetchall()
        print(f"Total raw products in DB: {len(raw_products)}")
        for i, p in enumerate(raw_products):
            print(f"Item {i}: id={p['id']}, name={p['name']}, category={p['category']}, user_name={p['user_name']}")
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")

    print("\n--- API RESPONSE CHECK ---")
    with app.test_client() as client:
        response = client.get('/products')
        print(f"Status: {response.status_code}")
        try:
            data = response.get_json()
            print(f"API returned {len(data)} items")
            if data and isinstance(data, list) and len(data) > 0:
                print("First item keys:", data[0].keys())
                preview = json.dumps(data[0])
                print("First item preview (first 200 chars):", str(preview)[:200])
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            raw_text = response.data.decode('utf-8') if hasattr(response.data, 'decode') else str(response.data)
            print("Response text:", raw_text[:500])

if __name__ == "__main__":
    debug_products()
