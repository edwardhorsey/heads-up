import os
import uuid
import requests

from .cognito import lambda_handler as decode_token

from .tables import table_connections
from .tables import table_games
from .tables import table_past_games

from .poker.game import Game

def put_display_name(connectionId, name):
    return table_connections.put_item(Item={'connectionId': connectionId, 'name': name})

def get_display_name(connectionId):
    user = table_connections.get_item(Key={'connectionId': connectionId})
    return user['Item']['name'] if user else False

def generate_game_id():
    return uuid.uuid4().hex[:10]

def re_map_game(game):
    return Game.re_map(game)

def put_game(gid, game):
    return table_games.put_item(Item={'gameId': gid, 'game': game.self_dict()})

def get_game(gid):
    game = table_games.get_item(Key={'gameId': gid})
    return re_map_game(game['Item']['game']) if game else False

async def get_access_tokens(code):
    url = os.environ['AWS_COGNITO_APP_URL']
    app_client_id = os.environ['AWS_COGNITO_APP_CLIENT_ID']

    response = requests.post(url + '/oauth2/token',{
        'Content-Type':'application/x-www-form-urlencoded',
        'grant_type': 'authorization_code',
        'client_id': app_client_id,
        'code': code,
        'redirect_uri': 'http://localhost:3000/'
    })

    return response.json()

async def get_user_profile(code):
    try:
        access_tokens = await get_access_tokens(code)
        print(access_tokens)
        if 'error' in access_tokens:
            raise Exception (access_tokens)
        else:
            if 'id_token' in access_tokens:
                event = { 'token': access_tokens['id_token'] }
                decoded_user = await decode_token(event, None)
                return decoded_user
    except Exception as e:
        return {
            'success': False,
            'message': repr(e)
        }