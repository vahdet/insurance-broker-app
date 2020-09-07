""" Application entrypoint """

import sqlite3
from passlib.apps import custom_app_context as pwd_context
from flask import Flask, g, request
from itsdangerous import URLSafeSerializer
import config

DATABASE = '/path/to/database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def get_agency_id(email: str) -> str:
    domain = email.split('@')[1]
    cur = get_db().cursor()
    cur.execute('''
            SELECT * FROM agency_domain_whitelist WHERE domain=?
        ''', (domain))
    rows = cur.fetchall()
    return ''

def hash_password(password: str) -> str:
    """ Hashes the password before storing it

    Args:
        password (str): Raw password

    Returns:
        str: Hashed password
    """
    return pwd_context.encrypt(password)

app = Flask(__name__)

@app.route('/api/users', methods=['POST'])
def sign_up() -> None:
    """[summary]

    Returns:
        str: Token as a serialized string
    """

    try:
        content = request.json
        cur = get_db().cursor()
        cur.execute('''
            INSERT INTO broker (agency_id, first_name, last_name, email, hash_password, address)
            VALUES (?,?,?,?,?,?)
        ''', (
            get_agency_id(content.get('email')),
            content.get('firstName'),
            content.get('lastName'),
            content.get('email'),
            hash_password(content.get('password')),
            content.get('address')
        ))
        return {}, 201
    except Exception as e:
        print(e)
        return str(e), 500

@app.route('/signIn')
def sign_in() -> str:
    """[summary]

    Returns:
        str: Token as a serialized string
    """
    
    # Deliberately choose a none-time-restricted token for the sake of simplicity
    ser = URLSafeSerializer(config['SECRET_KEY'])
    return ser.dumps({ 'agency': 'blah' })
