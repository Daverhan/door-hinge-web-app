from flask import Flask
from app.routes.users import user_bp
from app.routes.listings import listing_bp
from app.database import db
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')

    db.init_app(app)

    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(listing_bp, url_prefix='/api/listings')

    with app.app_context():
        db.create_all()

    return app
