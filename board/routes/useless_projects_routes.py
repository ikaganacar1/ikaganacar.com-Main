from board import app
from flask import (
    render_template
)

@app.route("/useless_projects")
def useless_projects():
    return render_template("useless_projects/useless_home_page.html")


@app.route("/useless_projects/balloons")
def balloons():
    return render_template("useless_projects/balloons.html")


@app.route("/useless_projects/howmuchmoneyleft")
def howmuchmoneyleft():
    return render_template("useless_projects/howmuchmoneyleft.html")


@app.route("/useless_projects/ika")
def ika():
    return render_template("useless_projects/ika.html")


#? Lot more Useless:
@app.route("/hearts8")
def hearts8():
    return render_template("pages/hearts8.html")


@app.route("/1025438697")
def _1025438697():
    return render_template("pages/1025438697.html")


@app.route("/_")
def _():
    return render_template("pages/_.html")
