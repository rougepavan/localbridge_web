import numpy as np
from PIL import Image
from model_loader import classifier_model, processor, caption_model, classes

# ================================
# MAIN PREDICTION FUNCTION
# ================================
def predict_all(img: Image.Image):
    
    # ===== CATEGORY PREDICTION =====
    img_resized = img.resize((224, 224))
    img_array = np.array(img_resized) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    pred = classifier_model.predict(img_array, verbose=0)
    category = classes[np.argmax(pred)]
    confidence = float(np.max(pred))

    # ===== CAPTION (DEEP AI) =====
    inputs = processor(img, return_tensors="pt")
    out = caption_model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)

    # ===== FRESHNESS LOGIC =====
    if category == "food":
        if confidence > 0.85:
            freshness = "Fresh"
        elif confidence > 0.6:
            freshness = "Moderate"
        else:
            freshness = "Check Quality"
    else:
        freshness = "Not Applicable"

    # ===== GENERATE PROFESSIONAL DESCRIPTION =====
    description = generate_fancy_description(category, caption, freshness, confidence)
    
    # ===== FINAL RESPONSE =====
    return {
        "category": category,
        "freshness": freshness,
        "description": description,
        "confidence": confidence
    }

def generate_fancy_description(cat, cap, fresh, conf):
    """Generates a professional marketplace description."""
    cap = cap.replace("a photo of", "").replace("an image of", "").strip().capitalize()
    
    templates = {
        "food": [
            f"Beautifully prepared {cap}. It's {fresh.lower()} and perfect for a quick neighborly exchange!",
            f"Delicious {cap} available. Quality check shows it's {fresh.lower()}. Who want's to swap?",
        ],
        "spices": [
            f"Highly aromatic {cap}. Great for adding some kick to your cooking. {fresh} quality.",
            f"Premium {cap} from my kitchen. It's {fresh.lower()} and ready for your next recipe.",
        ],
        "liquids": [
            f"Pure {cap} in great condition. Checked for quality: {fresh}.",
            f"Freshly bottled {cap}. {fresh} and ready for a new home.",
        ],
        "powders": [
            f"High quality {cap}. Useful for various household or cooking needs. Condition: {fresh}.",
        ],
        "others": [
            f"Check out this {cap}. It's in {fresh.lower()} condition and looking for a swap!",
        ]
    }
    
    import random
    options = templates.get(cat.lower(), templates["others"])
    return random.choice(options)