import os
import sys
import random
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset
from sklearn.model_selection import StratifiedShuffleSplit
from torchvision import datasets, transforms, models
from collections import Counter
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "model", "heritage_type_cnn.pth")
REPORT_SAVE_PATH = os.path.join(os.path.dirname(__file__), "model", "evaluasi_report.txt")
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15
LR = 0.0005
SEED = 42
TEST_PER_CLASS = 30
CLASSES = ["makam", "masjid", "rumah_adat"]
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

train_transform = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.RandomAffine(degrees=10, translate=(0.1, 0.1), scale=(0.9, 1.1)),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

eval_transform = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


def check_dataset():
    total = 0
    counts = {}
    for cls in CLASSES:
        cls_dir = os.path.join(DATASET_DIR, cls)
        count = len([f for f in os.listdir(cls_dir) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]) if os.path.exists(cls_dir) else 0
        print(f"  - {cls}: {count} foto")
        counts[cls] = count
        total += count
    return total, counts


def get_sampler(targets):
    class_counts = Counter(targets)
    weights = [1.0 / class_counts[t] for t in targets]
    return WeightedRandomSampler(weights, num_samples=len(targets), replacement=True)


def build_model():
    base_model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    for param in base_model.parameters():
        param.requires_grad = False
    nf = base_model.classifier[1].in_features
    base_model.classifier = nn.Sequential(
        nn.Dropout(0.4), nn.Linear(nf, 256), nn.ReLU(),
        nn.Dropout(0.4), nn.Linear(256, 128), nn.ReLU(),
        nn.Dropout(0.3), nn.Linear(128, len(CLASSES))
    )
    return base_model


def run_epoch(model, loader, criterion, optimizer):
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    for images, labels in loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += labels.size(0)
    return running_loss / total, correct / total


def get_test_indices(targets):
    test_idx = []
    for cls_idx, cls_name in enumerate(CLASSES):
        cls_indices = [i for i, t in enumerate(targets) if t == cls_idx]
        random.seed(SEED)
        random.shuffle(cls_indices)
        n_test = min(TEST_PER_CLASS, len(cls_indices))
        test_idx += cls_indices[:n_test]
    return test_idx


def auto_evaluate(model, test_idx=None):
    print("\n" + "=" * 55)
    print("  EVALUASI OTOMATIS (DATA UJI 10%)")
    print("=" * 55)

    full_dataset_eval = datasets.ImageFolder(DATASET_DIR, transform=eval_transform)
    total = len(full_dataset_eval)
    targets = [s[1] for s in full_dataset_eval.samples]
    if test_idx is None:
        test_idx = get_test_indices(targets)
    test_dataset = Subset(full_dataset_eval, test_idx)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=0)

    model.eval()
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

    print(f"\nTotal data        : {total}")
    print(f"Data train        : {total - len(test_idx)}")
    print(f"Data uji (test)   : {len(test_idx)} (10%)")
    print(f"Overall Accuracy  : {accuracy * 100:.2f}%\n")

    print("CONFUSION MATRIX:")
    header = "  {:>14}".format("")
    for c in CLASSES:
        header += "{:>14}".format(c[:12])
    print(header)
    for i, c in enumerate(CLASSES):
        row = "  {:>14}".format(c[:12])
        for j in range(len(CLASSES)):
            row += "{:>14}".format(cm[i][j])
        print(row)

    print("\nCLASSIFICATION REPORT:")
    print(report_str)

    os.makedirs(os.path.dirname(REPORT_SAVE_PATH), exist_ok=True)
    with open(REPORT_SAVE_PATH, "w", encoding="utf-8") as f:
        f.write("=" * 60 + "\n")
        f.write("  EVALUASI MODEL CNN - WARISAN BUDAYA SASAK\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Total data        : {total}\n")
        f.write(f"Data uji (test)   : {len(test_idx)} (10%)\n")
        f.write(f"Overall Accuracy  : {accuracy * 100:.2f}%\n\n")
        f.write("CONFUSION MATRIX:\n")
        header = "{:>14}".format("")
        for c in CLASSES:
            header += "{:>14}".format(c[:12])
        f.write(header + "\n")
        for i, c in enumerate(CLASSES):
            row = "{:>14}".format(c[:12])
            for j in range(len(CLASSES)):
                row += "{:>14}".format(cm[i][j])
            f.write(row + "\n")
        f.write("\nCLASSIFICATION REPORT:\n")
        f.write(report_str)

    print(f"Laporan tersimpan di: {REPORT_SAVE_PATH}")
    return accuracy


def train():
    print("=" * 55)
    print("  TRAINING + EVALUASI OTOMATIS CNN WARISAN SASAK")
    print("=" * 55)
    print(f"Device: {DEVICE}")
    print(f"\nDataset: {DATASET_DIR}")
    total_images, counts = check_dataset()
    if total_images < 20:
        print("\n[ERROR] Minimal 20 foto total.")
        sys.exit(1)
    print(f"\nTotal: {total_images} foto. Split 90% train / 10% test\n")

    full_dataset = datasets.ImageFolder(DATASET_DIR, transform=train_transform)
    targets = [s[1] for s in full_dataset.samples]
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.1, random_state=SEED)
    train_idx, test_idx = next(sss.split(np.arange(len(targets)), targets))
    train_dataset = Subset(full_dataset, train_idx)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)

    criterion = nn.CrossEntropyLoss()
    model = build_model().to(DEVICE)
    optimizer = optim.AdamW(model.classifier.parameters(), lr=LR, weight_decay=0.01)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

    print(f"--- Training {EPOCHS} epochs (Frozen Backbone) ---\n")
    for epoch in range(EPOCHS):
        train_loss, train_acc = run_epoch(model, train_loader, criterion, optimizer)
        scheduler.step()
        print(f"Epoch [{epoch+1}/{EPOCHS}]  Loss: {train_loss:.4f}  Acc: {train_acc*100:.1f}%")

    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    torch.save({
        "model_state_dict": model.state_dict(),
        "class_names": CLASSES,
    }, MODEL_SAVE_PATH)
    print(f"\nModel tersimpan: {MODEL_SAVE_PATH}")

    # Otomatis langsung evaluasi dengan data test yang sama
    auto_evaluate(model, test_idx)

    print("\n" + "=" * 55)
    print("TRAINING & EVALUASI SELESAI!")
    print("Restart CNN service untuk memakai model baru.")
    print("=" * 55)


if __name__ == "__main__":
    train()
