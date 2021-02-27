import json
import boto3
import os
import asyncio

dynamodb = boto3.client('dynamodb')

from .Poker.game import Game
from .Poker.player import Player

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
    gid = generate_GID() ### use uuid
    player_one = Player(connectionId, request['display-name'], 1000) ## get displayname from db for consistency
    this_game = Game(gid, player_one) ## makes game
    put_game(gid, this_game) 
    response = {
        'method': 'create-game',
        'uid': uid, ## neccesary ? 
        'gid': gid,
    }
    await connected[uid].send(json.dumps(response))