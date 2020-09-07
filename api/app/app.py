""" Application entrypoint """

import json
import sqlite3
from flask import Flask, g, request

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


@app.route('/api/users', methods=['GET', 'POST'])
def users():
    """ Gets and Creates users """
    try:
        if request.method == 'GET':
            # Get all from the broker_auth table
            cur = get_db().cursor()
            cur.execute('''
                SELECT 
                    b.first_name AS firstName,
                    b.last_name AS lastName,
                    b.email AS email,
                    b.address AS address,
                    a.name AS agencyName,
                    a.domain AS agencyDomain
                FROM broker b JOIN agency a ON b.agency_id=a.id
            ''')
            data = cur.fetchall()
            return json.dumps(data)

        if request.method == 'POST':
            # Add to broker table
            content = request.json
            cur = get_db().cursor()
            cur.execute('''
                INSERT INTO broker (broker_auth_id, email, agency_id, first_name, last_name, address)
                VALUES (?,?,?,?,?,?)
            ''', (
                content.get('brokerAuthId'),
                content.get('email'),
                content.get('agencyId'),
                content.get('firstName'),
                content.get('lastName'),
                content.get('address')
            ))
            return None, 201
        return None, 501
    except Exception as e:
        print(e)
        return str(e), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
