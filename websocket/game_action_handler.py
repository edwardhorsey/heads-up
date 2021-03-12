import simplejson as json 
import boto3
import os
import asyncio

from app.app import set_username
from app.app import create_game
from app.app import join_game
from app.app import ready_to_play
from app.app import all_in
from app.app import fold
from app.app import call
from app.app import back_to_lobby

async def main(event, context):
    print(event)

    # Player who sent request
    connectionId = event['requestContext']['connectionId']
    endpoint = get_endpoint(event)

    # Request body containing ACTION
    body = json.loads(event['body'])

    # Routes
    if body['method'] == 'setUsername':
        await set_username(endpoint, connectionId, body)
    elif body['method'] == 'createGame':
        await create_game(endpoint, connectionId, body)
    elif body['method'] == 'joinGame':
        await join_game(endpoint, connectionId, body)
    elif body['method'] == 'readyToPlay':
        await ready_to_play(endpoint, connectionId, body)
    elif body['method'] == 'allIn':
        await all_in(endpoint, connectionId, body)
    elif body['method'] == 'call':
        await call(endpoint, connectionId, body)
    elif body['method'] == 'fold':
        await fold(endpoint, connectionId, body)
    elif body['method'] == 'backToLobby':
        await back_to_lobby(endpoint, connectionId, body)
    else:
        response = {
            'method': body['method'],
            'message': 'Method not recognised',
        }

        # Emit response back to user
        endpoint = os.environ['API_ENDPOINT'] if os.environ['API_ENDPOINT'] else ("https://"
            + event["requestContext"]["domainName"]
            + "/"
            + event["requestContext"]["stage"])

        apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response),
            ConnectionId=connectionId
        )

    return {}

def handle(event, context):
    asyncio.run(main(event, context))
