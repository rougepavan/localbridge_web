import os
import sys

def check_ai():
    print("--- LocalBridge AI Debugger ---")
    
    # 1. Check Files
    files = ["localbridge_classifier.h5", "model_loader.py", "predictor.py", "smart_predictor.py"]
    for f in files:
        if os.path.exists(f):
            print(f"[OK] Found {f}")
        else:
            print(f"[MISSING] {f} is missing!")

    # 2. Check Dependencies
    libs = ["tensorflow", "torch", "transformers", "PIL", "numpy"]
    for lib in libs:
        try:
            __import__(lib if lib != "PIL" else "PIL")
            print(f"[OK] {lib} is installed.")
        except ImportError:
            print(f"[FAIL] {lib} is NOT installed.")

    # 3. Test Loader Logic (Simulating app1.py)
    try:
        from predictor import predict_all
        print("[OK] Real AI Predictor (TensorFlow) loaded successfully.")
    except Exception as e:
        print(f"[INFO] Real AI failed: {e}. Checking fallback...")
        try:
            from smart_predictor import predict_all
            print("[OK] Smart Fallback Predictor (PIL/NumPy) loaded successfully.")
            from PIL import Image
            import numpy as np
            test_img = Image.new('RGB', (100, 100), color='red')
            res = predict_all(test_img)
            print(f"[TEST] Prediction Result: {res['category']} ({res['confidence']*100:.1f}%)")
            print("[SUCCESS] AI Scan system is ready to use (via fallback)!")
        except Exception as e2:
            print(f"[FAIL] Both Real and Fallback AI failed: {e2}")

if __name__ == "__main__":
    check_ai()
