from board import db, login_manager
from flask import request
from datetime import datetime, date
from sqlalchemy import func
from flask_login import UserMixin
from hashlib import sha256

#Visint counting system cancelled for now
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    page_name = db.Column(db.String(200), nullable=False)
    visits = db.relationship("Visit", backref="page", lazy=True, order_by=lambda: Visit.date.desc())

    @property
    def visit_count(self):
        return len(self.visits)

    def __repr__(self) -> str:
        return f"History('{self.page_name}', '{self.visit_count}')"


class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    date = db.Column(db.DateTime, nullable=False, default=datetime.now(), index=True)
    ip_address = db.Column(db.String(100), nullable=False, default=lambda: request.environ["REMOTE_ADDR"])
    history_id = db.Column(db.Integer, db.ForeignKey("history.id"), nullable=False)

    def __repr__(self) -> str:
        return f"Visit('{self.date}', '{self.ip_address}')"


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    role = db.Column(db.String(30), unique=False, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(60), unique=False, nullable=False)

    type = db.Column(db.String(20))  # this is the discriminator column

    __mapper_args__ = {
        "polymorphic_on": type,
    }

    def __repr__(self) -> str:
        return f"User('{self.role}','{self.username}')"



