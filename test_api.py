import requests
import json

BASE_URL = "http://localhost:5000"

def test_products():
    try:
        response = requests.get(f"{BASE_URL}/products")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Count: {len(data)}")
        if data:
            print("First item preview:")
            print(json.dumps(data[0], indent=4))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_products()
