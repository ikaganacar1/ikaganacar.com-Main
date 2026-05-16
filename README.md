# ikaganacar.com

Source code for my personal website.

## Stack

### Frontend
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![Matter.js](https://img.shields.io/badge/Matter.js-2D%20Physics-2b2b2b)](#)

### Backend
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)
[![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=fff)](#)

## Features

### Home Page

The home page uses Matter.js for the interactive physics scene. The "Useless Projects" button hangs from a constraint, the social/action buttons are physics bodies, and clicking or dragging in the scene creates moving circles.

The left-side buttons link to social/contact destinations. The right-side buttons control the scene by changing gravity, recoloring balls, deleting balls, refreshing the page, and triggering party mode.

### Useless Projects

The `/useless_projects` page is another Matter.js scene that acts as a physics-based navigation page. Current project links include:

- Balloons
- How Much Money Left
- Ika's Stats
- Braindead Red Dot
- Donation

The `apartmanim` link is intentionally left as an external/separately deployed path.

### Other Pages

- `/1025438697`: puzzle/input page.
- `/_`: static puzzle/content page.
- `/donation`: donation page with crypto address copy support.

## Local Development

Create a virtual environment and install the dependencies:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

For security/development checks:

```bash
pip install -r requirements-dev.txt
```

Run the Flask app locally:

```bash
flask --app board run --port 8000 --debug
```

Open:

```text
http://127.0.0.1:8000/
```

## Configuration

The app reads:

- `SECRET_KEY` or `FLASK_SECRET_KEY` from the environment.
- `secret_key.txt` as a local fallback.
- `DATABASE_URL` for a custom database URL.

If no secret is configured, the app generates an ephemeral development key at startup. Set a persistent secret in production so sessions stay valid across restarts and workers.

Security hardening currently includes secure/HTTP-only session cookies, SameSite cookies, Content Security Policy, frame blocking, MIME sniffing protection, referrer policy, permissions policy, and HSTS when the request is HTTPS or `FORCE_HTTPS=1` is set.

Recommended checks before deployment:

```bash
bandit -r board -x board/__pycache__
pip-audit --cache-dir /tmp/pip-audit-cache
```

## Deployment Notes

`passenger_wsgi.py` is server-specific and should not be changed for local cleanup unless deployment behavior is being updated intentionally.

Apartmanim and IMC routes are deployed separately from this Flask app. Do not add or remove their routes here unless the deployment layout changes.

## Author

- [@ikaganacar1](https://github.com/ikaganacar1)
