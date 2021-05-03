import simplejson as json
import boto3
import os
import asyncio

from app.app import login
from app.app import create_game
from app.app import join_game
from app.app import add_chips
from app.app import ready_to_play
from app.app import all_in
from app.app import fold
from app.app import call
from app.app import back_to_lobby
from app.app import leave_game


async def main(event, context):
    # Player who sent request
    connectionId = event["requestContext"]["connectionId"]
    endpoint = (
        "http://localhost:3001/"
        if "IS_OFFLINE" in os.environ
        else (
            "https://"
            + event["requestContext"]["domainName"]
            + "/"
            + event["requestContext"]["stage"]
        )
    )

    # Request body containing ACTION
    body = json.loads(event["body"])
    print(f'ConnectionId: {connectionId}, Method: {body["method"]}')

    # Routes
    if body["method"] == "login":
        await login(endpoint, connectionId, body)
    elif body["method"] == "createGame":
        await create_game(endpoint, connectionId, body)
    elif body["method"] == "joinGame":
        await join_game(endpoint, connectionId, body)
    elif body["method"] == "addChips":
        await add_chips(endpoint, connectionId, body)
    elif body["method"] == "readyToPlay":
        await ready_to_play(endpoint, connectionId, body)
    elif body["method"] == "allIn":
        await all_in(endpoint, connectionId, body)
    elif body["method"] == "call":
        await call(endpoint, connectionId, body)
    elif body["method"] == "fold":
        await fold(endpoint, connectionId, body)
    elif body["method"] == "backToLobby":
        await back_to_lobby(endpoint, connectionId, body)
    elif body["method"] == "leaveGame":
        await leave_game(endpoint, connectionId, body)
    else:
        response = {
            "method": body["method"],
            "message": "Method not recognised",
        }

        # Emit response back to user
        apigatewaymanagementapi = boto3.client(
            "apigatewaymanagementapi", endpoint_url=endpoint
        )
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=connectionId
        )

    return {}


def handle(event, context):
    asyncio.run(main(event, context))

    return {}
