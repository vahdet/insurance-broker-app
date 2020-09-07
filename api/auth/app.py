""" Application entrypoint """

import os
import sqlite3
import hashlib
import requests
from flask import Flask, g, request
from itsdangerous import TimedJSONWebSignatureSerializer
import config

DATABASE = '../../COALITION.db'


def get_db():
    """ Get DB Connection """
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


app = Flask(__name__)


@app.teardown_appcontext
def close_connection(_exception):
    """ Close DB Connection """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/api/accounts', methods=['POST'])
def sign_up() -> None:
    """[summary]

    Returns:
        str: Token as a serialized string
    """

    try:
        content = request.json
        email = content.get('email')
        email_domain = email.split('@')[1]
        password = content.get('password')
        password_salt = os.urandom(32)
        password_hash_algorithm = 'sha256'

        password_hash = hashlib.pbkdf2_hmac(
            password_hash_algorithm,
            password.encode('utf-8'),
            password_salt,
            config.HASH_ITERATIONS
        )

        # Add to broker_auth table
        cur1 = get_db().cursor()
        cur1.execute('''
            INSERT INTO broker_auth (email, password_hash, password_salt, password_hash_algorithm)
            VALUES (?,?,?,?)
        ''', (
            email,
            password_hash,
            password_salt,
            password_hash_algorithm
        ))
        cur1.execute('SELECT LAST_INSERT_ROWID()')
        print(cur1.fetchone())
        last_insert_rowid_result = cur1.fetchone()
        last_insert_id = last_insert_rowid_result[0]

        # Determine the agency
        cur2 = get_db().cursor()
        cur2.execute('''
            SELECT
                a.id AS id,
                a.address AS address
            FROM agency_domain_whitelist w
            JOIN agency a ON w.domain=a.domain
            WHERE w.domain=?
        ''', (email_domain))

        agency_result = cur2.fetchone()
        agency_id = agency_result[0]

        # HERE API call: https://geocode.search.hereapi.com/v1/geocode?q={}

        # Insert to users table
        requests.post(f'{config.USER_API_BASE_URL}/api/users', data={
            'brokerAuthId': last_insert_id,
            'email': email,
            'agencyId': agency_id,
            'firstName': content.get('firstName'),
            'lastName': content.get('lastName'),
            'address': content.get('address')
        })

        return None, 201
    except sqlite3.Error as se:
        print("Failed to read data from db", se)
    except requests.exceptions.RequestException as re:
        print("Failed to make HTTP call", re)
    except Exception as e:
        print(e)
        return str(e), 500


@app.route('/token', methods=['POST'])
def get_token() -> str:
    """[summary]

    Returns:
        str: Token as a serialized string
    """

    # Check password
    content = request.json
    email = content.get('email')
    password_to_check = content.get('password')

    # Get existing record
    cur = get_db().cursor()
    cur.execute('''
        SELECT
            id,
            email,
            password_hash,
            password_salt,
            password_hash_algorithm
        FROM broker_auth
        Where email=?
    ''', (email))
    select_result = cur.fetchone()

    result_id = select_result[0]
    password_hash = select_result[1]
    password_salt = select_result[2]
    password_hash_algorithm = select_result[3]
    tried_password_hash = hashlib.pbkdf2_hmac(
        password_hash_algorithm,
        password_to_check.encode('utf-8'),  # Convert the password to bytes
        password_salt,
        config.HASH_ITERATIONS
    )

    # Check if password matches
    if tried_password_hash == password_hash:
        ser = TimedJSONWebSignatureSerializer(
            config.SECRET_KEY, expires_in=config.TOKEN_EXPIRATION)
        return ser.dumps({'id': result_id})
    return None, 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6001)
