from flask import (
    render_template,
    send_from_directory,
    url_for,
    request,
    redirect,
    abort,
    
)
from board import app, db
from board.models import (
    History,
    Visit,
)

import os



#? Routes -----------------------------------------------
@app.route("/home")
@app.route("/")
def home():
    return render_template("pages/home.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static/image"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )


@app.route("/donation")
def donation():
    return render_template("pages/donation.html")


@app.route("/test_page")
def test_page():
    return render_template("test_page/test_page.html")
