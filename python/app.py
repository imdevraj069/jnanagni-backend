import os
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Python service is running!"}

@app.route("/ping")
def ping():
    return "server is alive"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port)
