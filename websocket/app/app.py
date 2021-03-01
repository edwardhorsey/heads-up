import json
import boto3
import os
import asyncio
import uuid

dynamodb = boto3.client('dynamodb')

from .poker.game import Game
from .poker.player import Player

# Utils

def generate_game_id():
    return uuid.uuid4().hex

# Game functions
async def set_username(endpoint, connectionId, body):
    status = dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': body['username']}})

    response = {
        'method': 'setUsername',
        'success': status,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )

async def create_game(endpoint, connectionId, body):
    gid = generate_game_id() ### use uuid
    print(gid)
    player_one = Player(connectionId, body['displayName'], 1000) ## get displayname from db for consistency

    this_game = Game(gid, player_one) ## makes game
    print(this_game)

    game_dict = this_game.self_dict()
    
    # put game
    # def put_game(gid, game):
    #     game_dict = game.self_dict()
    #     item = {
    #         'gameId': gid,
    #         'game': game_dict
    #     }
    #     games_table.put_item(Item=item)


    # put_game(gid, this_game)
    status = dynamodb.put_item(TableName=os.environ['POKER_GAMES_TABLE_NAME'], Item={'gameId': {'S': gid}, 'game': {'M': game_dict}})
    print(status)

    response = {
        'method': 'createGame',
        'success': status,
        'uid': uid, ## neccesary ? 
        'gid': gid,
    }
    await connected[uid].send(json.dumps(response))