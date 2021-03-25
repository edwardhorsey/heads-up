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

def put_user_details(connectionId, userDetails):
    return table_connections.put_item(Item={'connectionId': connectionId, 'userToken': userDetails['sub'], 'userDetails': userDetails})

def check_is_user_token_exists(userToken):
    result = table_connections.query(
        IndexName="userTokenIndex",
        KeyConditionExpression=Key('userToken').eq('049ef12a-ef5a-4dff-816b-7d901e2a7168'),
    )
    return result['Items'] if result else False
)

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

    return requests.post(url + '/oauth2/token',{
        'Content-Type':'application/x-www-form-urlencoded',
        'grant_type': 'authorization_code',
        'client_id': app_client_id,
        'code': code,
        'redirect_uri': os.environ['AWS_COGNITO_APP_REDIRECT_URI']
    }).json()

async def get_user_profile(code):
    try:
        access_tokens = await get_access_tokens(code)
        if 'error' in access_tokens:
            raise Exception ('Failed to fetch from AWS Cognito oauth endpoint: ', access_tokens)
        else:
            if 'id_token' in access_tokens:
                event = { 'token': access_tokens['id_token'] }
                decoded_user = await decode_token(event, None)
                return decoded_user
            else:
                return False
    except Exception as error:
        print(error)
        return False