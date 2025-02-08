import requests

url = "https://openapi.tuyaus.com/v1.0/token?grant_type=1"

payload = {}
headers = {
  'client_id': '4fgcma3wh97nra5phuds',
  'sign': 'B3E3BEF5CB25061A22A1B004F5608D2CAAC67959A707722F0C86955F396A7374',
  't': '1738971543283',
  'sign_method': 'HMAC-SHA256',
  'nonce': '',
  'stringToSign': ''
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)