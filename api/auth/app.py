""" Application entrypoint """

from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from itsdangerous import TimedJSONWebSignatureSerializer
import utils.functions as f
import config

app = Flask(__name__)
CORS(app)
api = Api(app)


class AuthTokenApi(Resource):
    """ Api for Auth Tokens """

    def __init__(self):
        self.auth_parser = reqparse.RequestParser()
        self.auth_parser.add_argument('username', required=True)
        self.auth_parser.add_argument('password', required=True)
        super().__init__()

    def post(self):
        """ A dumb authentication module to act as a starting point """
        try:
            args = self.auth_parser.parse_args()
            username = args.get('username')
            password = args.get('password')
            if f.check_password(username, password):
                ser = TimedJSONWebSignatureSerializer(
                    config.SECRET_KEY, expires_in=config.TOKEN_EXPIRATION)
                token_bytes = ser.dumps({'type': 'admin'})
                return {
                    'token': token_bytes.decode('utf-8')
                }, 200, {'Set-Cookie': 'name=brokershub.auth.token'}
            return {}, 404
        except Exception as err:
            return f'Exception: {str(err)}', 500


api.add_resource(AuthTokenApi, '/tokens')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
