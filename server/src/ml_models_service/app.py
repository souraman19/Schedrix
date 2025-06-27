from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import os

model_path = os.path.join(os.path.dirname(__file__), 'lstm_model.h5')
model = tf.keras.models.load_model(model_path)

# Initialize Flask app
app = Flask(__name__) 

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['input']
    input_array = np.array(data)

    input_array = np.reshape(input_array, (1, input_array.shape[0], 9))

    prediction = model.predict(input_array)
    print(f"Prediction: {prediction}")
    pred_index = np.argmax(prediction, axis=1)[0]
    print(f"Predicted index: {pred_index}")

    mind_map = ['Default', 'Distressed', 'Focused', 'Motivated', 'Relaxed', 'Stressed', 'Tired']
    result = mind_map[pred_index]
    print(f"Predicted Mind Status: {result}")

    return jsonify({'predictedMindStatus': result})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6000))
    app.run(host='0.0.0.0', port=port)