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

def get_display_name(connectionId):
    user = table_connections.get_item(Key={'connectionId': connectionId})
    return user['Item']['name'] if user else False


def generate_game_id():
    return uuid.uuid4().hex[:10]

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
    gid = generate_game_id()

    display_name = get_display_name(connectionId)
    player_one = Player(connectionId, display_name, 1000)

    this_game = Game(gid, player_one)
    game_dict = this_game.self_dict()

    status = table_games.put_item(Item={'gameId': gid, 'game': game_dict})

    response = {
        'method': 'createGame',
        'success': status,
        'gid': gid,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )