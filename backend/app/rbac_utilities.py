from app.extensions import db
from contextlib import contextmanager
from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker


def create_mysql_user(username, password, role):
    create_user_sql = text(
        f"CREATE USER '{username}'@'localhost' IDENTIFIED BY '{password}';")
    grant_role_sql = text(
        f"GRANT '{role}'@'localhost' TO '{username}'@'localhost';")
    set_default_role_sql = text(
        f"SET DEFAULT ROLE '{role}'@'localhost' TO '{username}'@'localhost';")
    flush_privileges_sql = text("FLUSH PRIVILEGES;")

    with db.engine.connect() as connection:
        connection.execute(create_user_sql)
        connection.execute(grant_role_sql)
        connection.execute(set_default_role_sql)
        connection.execute(flush_privileges_sql)


def create_roles():
    roles_sql = [text(f"CREATE ROLE IF NOT EXISTS 'user'@'localhost';"),
                 text(f"CREATE ROLE IF NOT EXISTS 'moderator'@'localhost';"),
                 text(f"CREATE ROLE IF NOT EXISTS 'admin'@'localhost';")]

    # TO-DO: Add required grant statements for user and moderator roles
    grants_sql = [
        text(f"GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;"),
        text(f"GRANT SELECT ON project.user TO 'user'@'localhost';"),
        text(f"GRANT SELECT ON project.listing TO 'user'@'localhost';"),
        text(f"GRANT INSERT ON project.user_favorited_listing TO 'user'@'localhost';"),
        text(f"GRANT INSERT ON project.user_passed_listing TO 'user'@'localhost';"),
        text(f"GRANT SELECT ON project.user_favorited_listing TO 'user'@'localhost';"),
        text(f"GRANT SELECT ON project.user_passed_listing TO 'user'@'localhost';"),
        text(f"GRANT SELECT ON project.address TO 'user'@'localhost';"),
        text(f"GRANT SELECT ON project.image TO 'user'@'localhost';"),
        text(f"GRANT INSERT ON project.listing to 'user'@'localhost';"),
        text(f"GRANT INSERT ON project.address TO 'user'@'localhost';"),
        text(f"GRANT INSERT ON project.image TO 'user'@'localhost';")]

    with db.engine.connect() as connection:
        for sql_statement in roles_sql + grants_sql:
            connection.execute(sql_statement)

        connection.execute(text("FLUSH PRIVILEGES;"))


def create_new_connection(username, password):
    engine = create_engine(
        f'mysql+pymysql://{username}:{password}@localhost/project')
    Session = sessionmaker(bind=engine)

    return Session()


@contextmanager
def safe_db_connection(username, password):
    user_db_session = create_new_connection(username, password)
    try:
        yield user_db_session
    finally:
        user_db_session.close()
