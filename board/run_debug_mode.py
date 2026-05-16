import os

from board import app


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=8000,
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
