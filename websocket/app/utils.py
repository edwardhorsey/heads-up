import os
import uuid
import requests
from boto3.dynamodb.conditions import Key

from .tables import table_connections
from .tables import table_games
from .tables import table_past_games

from .cognito_lambda import lambda_handler as decode_token
from .poker.game import Game

def put_display_name(connectionId, displayName):
    return table_connections.put_item(Item={'connectionId': connectionId, 'displayName': displayName})

def get_display_name(connectionId):
    user = table_connections.get_item(Key={'connectionId': connectionId})
    return user['Item']['displayName'] if user else False

def put_user_details(connectionId, userDetails):
    return table_connections.put_item(
        Item={
            'connectionId': connectionId,
            'displayName': userDetails['cognito:username'],
            'userToken': userDetails['sub'],
            'userDetails': userDetails,
        }
    )

def remove_user_details(connectionIds):
    print(connectionIds)
    for connectionId in connectionIds:
        table_connections.update_item(
            Key = {'connectionId': connectionId},
            UpdateExpression="REMOVE displayName, userToken, userDetails",
        )

def check_if_user_token_exists(userToken):
    print('hi ed')
    print(userToken)
    result = table_connections.query(
        IndexName="userTokenIndex",
        KeyConditionExpression=Key('userToken').eq(userToken),
    )
    return result['Items'] if result else False

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
    redirect_uri = 'http://localhost:3000/logging-in/' if 'IS_OFFLINE' in os.environ else (
        os.environ['AWS_COGNITO_APP_REDIRECT_URI']
    )

    return requests.post(url + '/oauth2/token',{
        'Content-Type':'application/x-www-form-urlencoded',
        'grant_type': 'authorization_code',
        'client_id': app_client_id,
        'code': code,
        'redirect_uri': redirect_uri,
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