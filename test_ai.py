import requests
import io

BASE_URL = "http://localhost:5001"

def test_analyze():
    print("Testing /analyze-ingredients...")
    try:
        # Create a mock image file
        files = {'image': ('test_oats.jpg', io.BytesIO(b"fake image data"), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/analyze-ingredients", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Full Text: {response.text}") # Print raw text if JSON decoding fails
        try:
            print(f"Response JSON: {response.json()}")
        except:
            print("Failed to decode JSON.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze()
