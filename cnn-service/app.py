import io
import os
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify

app = Flask(__name__)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

TIPE_LABELS = ['makam', 'masjid', 'rumah_adat']

model_tipe = None

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


def build_mobilenet(num_classes):
    base_model = models.mobilenet_v2(weights=None)
    num_features = base_model.classifier[1].in_features
    base_model.classifier = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(num_features, 256),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(256, 128),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(128, num_classes)
    )
    return base_model


def load_models():
    global model_tipe

    tipe_path = os.path.join(os.path.dirname(__file__), 'model', 'heritage_type_cnn.pth')
    if os.path.exists(tipe_path):
        try:
            m = build_mobilenet(len(TIPE_LABELS))
            checkpoint = torch.load(tipe_path, map_location=DEVICE)
            m.load_state_dict(checkpoint['model_state_dict'])
            m.to(DEVICE)
            m.eval()
            model_tipe = m
            print(f"Model Tipe PyTorch dimuat dari {tipe_path}")
        except Exception as e:
            print(f"Gagal memuat model tipe: {e}")
    else:
        print("Model Tipe (.pth) belum ada — endpoint /classify-type pakai placeholder")


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'device': str(DEVICE),
        'model_tipe_loaded': model_tipe is not None,
        'message': 'CNN Service berjalan'
    })


@app.route('/classify-type', methods=['POST'])
def classify_type():
    if 'foto' not in request.files:
        return jsonify({'error': 'File foto tidak ditemukan'}), 400

    file = request.files['foto']
    if file.filename == '':
        return jsonify({'error': 'Nama file kosong'}), 400

    try:
        image_bytes = file.read()

        if model_tipe is None:
            return jsonify({
                'tipe': None,
                'confidence': None,
                'skor': {},
                'model_version': 'placeholder',
                'perlu_verifikasi': False,
                'catatan': 'Model belum dimuat'
            })

        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = model_tipe(tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            idx = torch.argmax(probs).item()

        label = TIPE_LABELS[idx]
        confidence = float(probs[idx].item())

        scores = {}
        for i, lbl in enumerate(TIPE_LABELS):
            scores[lbl] = round(float(probs[i].item()), 4)

        return jsonify({
            'tipe': label,
            'confidence': round(confidence, 4),
            'skor': scores,
            'model_version': 'pytorch-v1.0',
            'perlu_verifikasi': confidence < 0.60
        })

    except Exception as e:
        return jsonify({'error': str(e), 'tipe': None}), 500


@app.route('/metrics', methods=['GET'])
def metrics():
    try:
        eval_path = os.path.join(os.path.dirname(__file__), 'model', 'evaluasi_report.txt')
        if not os.path.exists(eval_path):
            return jsonify({'error': 'Evaluasi report tidak tersedia'}), 404

        report = {
            'accuracy': None,
            'total_data': None,
            'validation_data': None,
            'confusion_matrix': {},
            'per_class': {},
            'macro_avg': {},
            'weighted_avg': {}
        }

        with open(eval_path, 'r') as f:
            lines = [l.strip() for l in f.readlines()]

        for line in lines:
            if line.startswith('Total data'):
                report['total_data'] = line.split(':')[1].strip()
            elif line.startswith('Validation data'):
                report['validation_data'] = line.split(':')[1].strip()
            elif line.startswith('Overall Accuracy'):
                report['accuracy'] = line.split(':')[1].strip().replace('%', '')
            elif 'precision' in line and 'recall' in line and 'f1-score' in line:
                continue
            elif line.startswith('accuracy'):
                parts = line.split()
                if len(parts) >= 3:
                    report['accuracy'] = parts[1]
            elif line.startswith('macro avg') or line.startswith('weighted avg'):
                parts = line.split()
                key = parts[0] + '_' + parts[1]
                if len(parts) >= 5:
                    report[key] = {
                        'precision': parts[2],
                        'recall': parts[3],
                        'f1_score': parts[4]
                    }
            elif not line.startswith(('=', '-', 'CONFUSION', 'CLASSIFICATION', 'Total', 'Valid', 'Over')):
                parts = line.split()
                if len(parts) >= 5 and parts[0] in TIPE_LABELS:
                    report['per_class'][parts[0]] = {
                        'precision': parts[1],
                        'recall': parts[2],
                        'f1_score': parts[3],
                        'support': parts[4]
                    }

        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    load_models()
    print("CNN Service berjalan di http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
