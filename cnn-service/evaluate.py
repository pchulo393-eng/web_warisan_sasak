import os
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, Subset
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import numpy as np
from sklearn.model_selection import StratifiedShuffleSplit

DATASET_DIR = os.path.join(os.path.dirname(__file__), 'dataset')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'heritage_type_cnn.pth')
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
CLASSES = ['makam', 'masjid', 'rumah_adat']
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
SEED = 42
TEST_RATIO = 0.1

transform = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


def build_model(num_classes):
    base = models.mobilenet_v2(weights=None)
    nf = base.classifier[1].in_features
    base.classifier = nn.Sequential(
        nn.Dropout(0.4), nn.Linear(nf, 256), nn.ReLU(),
        nn.Dropout(0.4), nn.Linear(256, 128), nn.ReLU(),
        nn.Dropout(0.3), nn.Linear(128, num_classes)
    )
    return base


def get_test_indices(targets):
    sss = StratifiedShuffleSplit(n_splits=1, test_size=TEST_RATIO, random_state=SEED)
    _, test_idx = next(sss.split(np.arange(len(targets)), targets))
    return test_idx


def evaluate():
    print('=' * 60)
    print('  EVALUASI MODEL CNN - WARISAN BUDAYA SASAK')
    print('=' * 60)
    print('Device :', DEVICE)
    print('Model  :', MODEL_PATH)

    if not os.path.exists(MODEL_PATH):
        print('\n[ERROR] Model belum ditemukan! Jalankan train.py terlebih dahulu.')
        return

    model = build_model(len(CLASSES))
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(DEVICE)
    model.eval()

    val_acc = checkpoint.get('val_accuracy', None)
    if val_acc:
        print('Val accuracy saat training: {:.2f}%'.format(val_acc * 100))

    full_dataset = datasets.ImageFolder(DATASET_DIR, transform=transform)
    total = len(full_dataset)
    targets = [s[1] for s in full_dataset.samples]
    test_idx = get_test_indices(targets)
    test_dataset = Subset(full_dataset, test_idx)
    train_size = total - len(test_idx)
    test_size = len(test_idx)

    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(DEVICE)
            outputs = model(images)
            _, predicted = outputs.max(1)
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.numpy())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    accuracy = accuracy_score(all_labels, all_preds)
    cm = confusion_matrix(all_labels, all_preds, labels=list(range(len(CLASSES))))
    report_dict = classification_report(all_labels, all_preds, target_names=CLASSES, output_dict=True, zero_division=0)
    report_str = classification_report(all_labels, all_preds, target_names=CLASSES, zero_division=0)

    sep = '-' * 60

    print('\n' + sep)
    print('  HASIL EVALUASI')
    print(sep)

    print('\nTotal data        :', total)
    print('Train data        :', train_size)
    print('Test data         :', test_size)
    print('\nData per kelas (test):')
    unique, counts = np.unique(all_labels, return_counts=True)
    for i, c in enumerate(CLASSES):
        print('  - {}: {}'.format(c, counts[i]))

    print('\n' + sep)
    print('  OVERALL ACCURACY: {:.2f}%'.format(accuracy * 100))
    print(sep)

    print('\n  CONFUSION MATRIX:')
    header = '  {:>14}'.format('')
    for c in CLASSES:
        header += '{:>14}'.format(c[:12])
    print(header)
    for i, c in enumerate(CLASSES):
        row = '  {:>14}'.format(c[:12])
        for j in range(len(CLASSES)):
            row += '{:>14}'.format(cm[i][j])
        print(row)

    print('\n  DETAILED CLASSIFICATION REPORT:')
    print(report_str)

    print('  PER-CLASS SUMMARY:')
    print('  {:>14} {:>10} {:>10} {:>10} {:>10}'.format('Kelas', 'Precision', 'Recall', 'F1-Score', 'Support'))
    print('  ' + '-' * 56)
    for cls in CLASSES:
        r = report_dict[cls]
        print('  {:>14} {:>10.4f} {:>10.4f} {:>10.4f} {:>10.0f}'.format(
            cls, r['precision'], r['recall'], r['f1-score'], r['support']))
    print('  ' + '-' * 56)
    print('  {:>14} {:>10} {:>10} {:>10.4f} {:>10}'.format(
        'Accuracy', '', '', accuracy, len(all_labels)))

    report_path = os.path.join(os.path.dirname(__file__), 'model', 'evaluasi_report.txt')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write('=' * 60 + '\n')
        f.write('  EVALUASI MODEL CNN - WARISAN BUDAYA SASAK\n')
        f.write('=' * 60 + '\n\n')
        f.write('Total data        : {}\n'.format(total))
        f.write('Train data        : {}\n'.format(train_size))
        f.write('Test data        : {}\n'.format(test_size))
        f.write('Overall Accuracy  : {:.2f}%\n\n'.format(accuracy * 100))
        f.write('CONFUSION MATRIX:\n')
        header = '{:>14}'.format('')
        for c in CLASSES:
            header += '{:>14}'.format(c[:12])
        f.write(header + '\n')
        for i, c in enumerate(CLASSES):
            row = '{:>14}'.format(c[:12])
            for j in range(len(CLASSES)):
                row += '{:>14}'.format(cm[i][j])
            f.write(row + '\n')
        f.write('\nCLASSIFICATION REPORT:\n')
        f.write(report_str)

    print('\nLaporan tersimpan:', report_path)
    print(sep)


if __name__ == '__main__':
    evaluate()
