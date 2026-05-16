from flask import Flask, request
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
#from flask_login import LoginManager
import os
import secrets
import warnings
from pathlib import Path

# TODO: SSL sertificate to make website HTTPS://

basedir = Path(__file__).resolve().parent
project_root = basedir.parent

app = Flask(__name__)
application = app


app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL",
    "sqlite:///" + str(basedir / "site.db"),
)


def load_secret_key():
    secret_key = os.environ.get("SECRET_KEY") or os.environ.get("FLASK_SECRET_KEY")
    if secret_key:
        return secret_key

    secret_key_file = project_root / "secret_key.txt"
    try:
        secret_key = secret_key_file.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        secret_key = None

    if secret_key:
        return secret_key

    warnings.warn(
        "SECRET_KEY is not configured; using an ephemeral development key. "
        "Set SECRET_KEY or FLASK_SECRET_KEY in production.",
        RuntimeWarning,
        stacklevel=2,
    )
    return secrets.token_urlsafe(32)


app.config["SECRET_KEY"] = load_secret_key()
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = True


@app.after_request
def add_security_headers(response):
    csp_directives = [
        "default-src 'self'",
        "script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://media.publit.io",
        "media-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ]
    if request.is_secure or os.environ.get("FORCE_HTTPS") == "1":
        csp_directives.append("upgrade-insecure-requests")

    csp = "; ".join(csp_directives)
    response.headers.setdefault("Content-Security-Policy", csp)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
        "Permissions-Policy",
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    )
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    if request.is_secure or os.environ.get("FORCE_HTTPS") == "1":
        response.headers.setdefault(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains",
        )
    return response


convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(app, metadata=metadata)
bcrypt = Bcrypt(app)
#login_manager = LoginManager(app)
#login_manager.session_protection = "strong"

from board.routes import (
    main_routes,
    admin_routes,
    useless_projects_routes,
    error_routes,
)

from flask_migrate import Migrate
migrate = Migrate(app, db,render_as_batch=True)
