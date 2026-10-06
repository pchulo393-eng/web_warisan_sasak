import urllib.request
import json
import uuid

BASE = 'http://localhost:8001/api'

# 1. Login
data = json.dumps({'email': 'admin@warisan.com', 'password': 'admin123'}).encode('utf-8')
req = urllib.request.Request(f'{BASE}/auth/login', data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as resp:
    token = json.loads(resp.read())['token']
print('Login OK, token:', token[:20])

# 2. Upload test image
boundary = '----WebKitFormBoundary' + uuid.uuid4().hex
c_type = f'multipart/form-data; boundary={boundary}'

with open(r'C:\Users\DOSEN\AppData\Local\Temp\test-upload\test.jpg', 'rb') as f:
    img_data = f.read()

body = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="foto"; filename="test.jpg"\r\n'
    f'Content-Type: image/jpeg\r\n\r\n'
).encode('utf-8') + img_data + f'\r\n--{boundary}--\r\n'.encode('utf-8')

req2 = urllib.request.Request(
    f'{BASE}/admin/heritage/1/photos',
    data=body,
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': c_type,
        'Accept': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req2) as resp:
        print('Upload Status:', resp.status)
        print('Response:', resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR:', e.code)
    print('Body:', e.read().decode('utf-8'))
except Exception as e:
    print('ERROR:', e)
