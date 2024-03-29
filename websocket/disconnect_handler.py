import simplejson as json
import boto3
import os

from app.utils import get_all_by_connection
from app.utils import withdraw_chips_from_game
from app.utils import get_game
from app.utils import put_game

dynamodb = boto3.client("dynamodb")


def handle(event, context):
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

    items = get_all_by_connection(connectionId)

    bankroll = user_token = gid = None
    for item in items:
        if "bankroll" in item:
            bankroll = item["bankroll"]
        if "userTokenPK" in item:
            user_token = item["userTokenPK"]
        if "gameIdPK" in item:
            gid = item["gameIdPK"]

    if bankroll and user_token and gid:
        this_game = get_game(gid)
        withdraw_chips_from_game(connectionId, bankroll, user_token, this_game)
        this_game.remove_player(connectionId)
        put_game(gid, this_game)

        # send response to other player
        response = {
            "method": "playerLeft",
            "gid": gid,
            "playerLeftMessage": "Your opponent has left the game",
        }

        clients = this_game.get_clients()
        apigatewaymanagementapi = boto3.client(
            "apigatewaymanagementapi", endpoint_url=endpoint
        )

        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response), ConnectionId=client
            )

    dynamodb.delete_item(
        TableName=os.environ["POKER_TABLE_NAME"],
        Key={
            "PK": {"S": connectionId},
            "SK": {"S": connectionId},
        },
    )

    return {}
