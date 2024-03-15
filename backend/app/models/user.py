from datetime import datetime
from app.extensions import db
from flask import url_for

user_chat_association = db.Table('user_chat',
                                 db.Column('user_id', db.Integer, db.ForeignKey(
                                     'user.id'), primary_key=True),
                                 db.Column('chat_id', db.Integer, db.ForeignKey(
                                     'chat.id'), primary_key=True))

user_listing_association = db.Table('user_listing',
                                    db.Column('user_id', db.Integer, db.ForeignKey(
                                        'user.id'), primary_key=True),
                                    db.Column('listing_id', db.Integer, db.ForeignKey(
                                        'listing.id'), primary_key=True))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    chats = db.relationship('Chat', secondary=user_chat_association,
                            backref=db.backref('users', lazy='dynamic'))
    favorited_listings = db.relationship('Listing', secondary=user_listing_association,
                                         backref=db.backref('users', lazy='dynamic'))
    sent_messages = db.relationship('Message', backref='sender')
    listings = db.relationship('Listing', backref='user')

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username,
            'password': self.password,
            'listings': [listing.to_dict() for listing in self.listings],
            'favorited_listings': [listing.to_dict() for listing in self.favorited_listings],
            'chats': [chat.to_dict() for chat in self.chats]
        }


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_num = db.Column(db.Integer, nullable=False)
    street_name = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(10), nullable=False)
    zip_code = db.Column(db.Integer, nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey(
        'listing.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'house_num': self.house_num,
            'street_name': self.street_name,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'listing_id': self.listing_id
        }


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey(
        'listing.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(1024), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'name': self.name,
            'path': url_for('static', filename=self.path)
        }


class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    num_beds = db.Column(db.Integer, nullable=False)
    num_baths = db.Column(db.Integer, nullable=False)
    sqft = db.Column(db.Integer, nullable=False)
    addresses = db.relationship(
        'Address', backref='listing', lazy=True, cascade="all, delete-orphan")
    images = db.relationship(
        'Image', backref='listing', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'desc': self.desc,
            'price': self.price,
            'num_beds': self.num_beds,
            'num_baths': self.num_baths,
            'sqft': self.sqft,
            'addresses': [address.to_dict() for address in self.addresses],
            'images': [images.to_dict() for images in self.images]
        }


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp,
            'chat_id': self.chat_id,
            'sender_id': self.sender_id
        }


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship(
        'Message', backref='chat', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'messages': [message.to_dict() for message in self.messages]
        }
