import warnings
warnings.filterwarnings("ignore")

import sys
sys.path.append('/usr/local/lib/python3.8/site-packages')

import os
import json
import cv2
import tensorflow as tf

# modelPath = sys.argv[2]
# os.chdir(modelPath)

model = tf.keras.models.load_model("model.hdf5")

pixels = cv2.imread(sys.argv[1]).reshape(-1, 512, 512, 3)

print(json.dumps(model.predict(pixels).tolist()))
sys.stdout.flush()