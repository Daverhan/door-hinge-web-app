from flask import Flask
from flask_migrate import Migrate
from flask_session import Session
from app.routes.users import user_bp
from app.routes.listings import listing_bp
from app.extensions import db, bcrypt
from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
    app.config['SESSION_TYPE'] = 'sqlalchemy'
    app.config['SESSION_SQLALCHEMY_TABLE'] = 'flask_sessions'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_USE_SIGNER'] = True

    db.init_app(app)
    app.config['SESSION_SQLALCHEMY'] = db
    bcrypt.init_app(app)
    migrate = Migrate(app, db)
    server_session = Session(app)

    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(listing_bp, url_prefix='/api/listings')

    return app
