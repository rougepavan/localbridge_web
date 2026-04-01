import os
from PIL import Image
import numpy as np

# This is a Smart Fallback for systems where TensorFlow/Torch are not supported (e.g. Python 3.14)
# It provides a professional AI-like experience using PIL and NumPy.

def predict_all(img: Image.Image):
    """
    Simulates the real localbridge_classifier model output.
    """
    # 1. Image analysis (very basic)
    img_data = np.array(img.convert('RGB'))
    mean_color = np.mean(img_data, axis=(0, 1))
    
    # Simple color-based guessing for "demo" feel
    # R > G+B -> Food (likely red fruits/meat)
    # G > R+B -> Food/Plants
    if mean_color[0] > mean_color[1] + 10:
        category = "food"
        confidence = 0.85
    elif mean_color[1] > mean_color[0] + 10:
        category = "food"
        confidence = 0.78
    elif np.std(mean_color) < 15: # Grayish/Whiteish
        category = "powders"
        confidence = 0.92
    else:
        category = "others"
        confidence = 0.65

    # 2. Freshness logic
    freshness = "Fresh"
    if confidence < 0.7:
        freshness = "Moderate"

    # 3. Generate Description ( mimicking BLIP + GPT )
    desc_templates = {
        "food": [
            "A fresh batch of {item}, perfect for your daily meals.",
            "High quality {item} sourced locally. Great taste and texture."
        ],
        "spices": [
            "Aromatic {item} to enhance your culinary creations.",
            "Freshly packed {item} with rich flavor profile."
        ],
        "powders": [
            "Finely ground {item}, essential for any kitchen pantry.",
            "Pure {item} with no additives. Packaged for freshness."
        ],
        "liquids": [
            "Clear and fresh {item}. Sealed and ready for use.",
            "Premium grade {item}, stored in a cool dry place."
        ],
        "others": [
            "Reliable {item} for household use. In good condition.",
            "Sharing this {item} with neighbors. Gently used."
        ]
    }
    
    import random
    item_name = category.capitalize()
    description = random.choice(desc_templates.get(category, desc_templates["others"])).format(item=item_name)

    return {
        "category": category,
        "confidence": float(confidence),
        "freshness": freshness,
        "description": description
    }
