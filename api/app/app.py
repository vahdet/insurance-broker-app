""" Application entrypoint """

import sqlite3
# import asyncio
from flask import Flask, g
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import utils.functions as f

DATABASE = '../../COALITION.db'

app = Flask(__name__)
CORS(app)
api = Api(app)


def get_db():
    """ Get DB Connection """
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(_exception):
    """ Close DB Connection """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


class UserApi(Resource):
    """ Api for User """

    def __init__(self):
        self.user_parser = reqparse.RequestParser()
        self.user_parser.add_argument('email', required=True)
        self.user_parser.add_argument('firstName', required=True)
        self.user_parser.add_argument('lastName', required=True)
        self.user_parser.add_argument('address', required=True)
        super().__init__()

    def get(self):
        try:
            # Get all from the broker_auth table
            cur = get_db().cursor()
            cur.execute('''
                SELECT 
                    b.id AS id,
                    b.first_name AS firstName,
                    b.last_name AS lastName,
                    b.email AS email,
                    b.address AS address,
                    a.title AS agencyTitle,
                    a.domain AS agencyDomain
                FROM broker b JOIN agency a ON b.agency_id=a.id
            ''')
            rows = cur.fetchall()
            results = []
            for row in rows:
                results.append({
                    'id': row[0],
                    'firstName': row[1],
                    'lastName': row[2],
                    'email': row[3],
                    'address': row[4],
                    'agency': {
                        'title': row[5],
                        'domain': row[6]
                    }
                })
            return results
        except sqlite3.Error as sql_err:
            return f'DB Exception: {str(sql_err)}', 500
        except Exception as err:
            return f'Exception: {str(err)}', 500

    def post(self):
        """ Add to broker table """
        try:
            # Get request body args
            args = self.user_parser.parse_args()
            email = args.get('email')
            address = args.get('address')
            broker_email_domain = email.split('@')[1]
            if not broker_email_domain:
                raise ValueError('Email address do not have a valid domain')

            # Get matching agencies
            conn = get_db()
            cur = conn.cursor()
            cur.execute('''
                SELECT
                    a.id,
                    a.address
                FROM agency_domain_whitelist adw
                JOIN agency a ON a.domain=adw.domain
                WHERE adw.domain=?
            ''', (broker_email_domain,))

            matching_agency_rows = cur.fetchall()
            matching_agencies = []
            for row in matching_agency_rows:
                matching_agencies.append({
                    'id': row[0],
                    'address': row[1]
                })
            agency_id = f.calculate_agency(address, matching_agencies)

            # Insert to broker table
            cur.execute('''
                INSERT INTO broker (email, agency_id, first_name, last_name, address)
                VALUES (?,?,?,?,?)
            ''', (
                email,
                agency_id,
                args.get('firstName'),
                args.get('lastName'),
                address
            ))
            conn.commit()
            return {'id': cur.lastrowid}, 201
        except sqlite3.Error as sql_err:
            return f'DB Exception: {str(sql_err)}', 500
        except Exception as err:
            return f'Exception: {str(err)}', 500


api.add_resource(UserApi, '/api/users')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
