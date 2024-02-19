from app.database import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username,
            'password': self.password
        }


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_num = db.Column(db.Integer, nullable=False)
    street_name = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(10), nullable=False)
    zip_code = db.Column(db.Integer, nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey(
        'listing.id'))

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
        'listing.id'))
    name = db.Column(db.String(50), nullable=False)
    path = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'name': self.name,
            'path': self.path
        }


class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lister_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    num_beds = db.Column(db.Integer, nullable=False)
    num_baths = db.Column(db.Integer, nullable=False)
    sqft = db.Column(db.Integer, nullable=False)
    addresses = db.relationship(
        'Address', backref='Listing', lazy=True, cascade="all, delete-orphan")
    images = db.relationship(
        'Image', backref='Listing', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'lister_id': self.lister_id,
            'desc': self.desc,
            'price': self.price,
            'num_beds': self.num_beds,
            'num_baths': self.num_baths,
            'sqft': self.sqft,
            'addr_id': [Address.to_dict() for Address in self.addr_id],
            'image_id': [Images.to_dict() for Images in self.image_id]
        }


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp,
            'chat_id': self.chat_id
        }


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship(
        'Message', backref='Chat', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'messages': [Message.to_dict() for Message in self.messages]
        }
