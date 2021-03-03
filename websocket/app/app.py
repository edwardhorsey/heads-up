import json
import boto3
import os
import asyncio
import uuid

dynamodb = boto3.resource('dynamodb')
table_connections = dynamodb.Table(os.environ['POKER_CONNECTIONS_TABLE_NAME'])
table_games = dynamodb.Table(os.environ['POKER_GAMES_TABLE_NAME'])
table_past_games = dynamodb.Table(os.environ['POKER_PAST_GAMES_TABLE_NAME'])

from .poker.game import Game
from .poker.player import Player

# Utils

def generate_game_id():
    return uuid.uuid4().hex

# Game functions
async def set_username(endpoint, connectionId, body):
    status = table_connections.put_item(Item={'connectionId': connectionId, 'name': body['username']})

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
    status = table_games.put_item(Item={'gameId': gid, 'game': game_dict})
    print(status)

    response = {
        'method': 'createGame',
        'success': status,
        'uid': connectionId, ## neccesary ? 
        'gid': gid,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )