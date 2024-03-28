from app.extensions import db
from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker


def create_mysql_user(username, password, role):
    create_user_sql = text(
        f"CREATE USER '{username}'@'localhost' IDENTIFIED BY '{password}';")
    grant_role_sql = text(
        f"GRANT '{role}'@'localhost' TO '{username}'@'localhost';")
    flush_privileges_sql = text("FLUSH PRIVILEGES;")

    with db.engine.connect() as connection:
        connection.execute(create_user_sql)
        connection.execute(grant_role_sql)
        connection.execute(flush_privileges_sql)


def create_new_connection(username, password):
    engine = create_engine(
        f'mysql+pymysql://{username}:{password}@localhost/project')
    Session = sessionmaker(bind=engine)

    return Session
