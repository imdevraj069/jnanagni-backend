import urllib.request
import os
import sys

port = os.environ.get("PORT", "8002")
url = f"http://localhost:{port}/ping"
try:
    with urllib.request.urlopen(url) as response:
        body = response.read().decode('utf-8')
        if body == "server is alive":
            print("Healthcheck passed: server is alive")
            sys.exit(0)
        else:
            print(f"Healthcheck failed: unexpected response body: {body}")
            sys.exit(1)
except Exception as e:
    print(f"Healthcheck failed: {e}")
    sys.exit(1)