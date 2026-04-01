import os
# ✅ LOAD .h5 MODEL
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "localbridge_classifier.h5")
classifier_model = tf.keras.models.load_model(model_path)

# Caption model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

classes = ["food", "spices", "powders", "liquids", "others"]