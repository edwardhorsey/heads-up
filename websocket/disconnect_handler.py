import json
import boto3
import os

from app.utils import get_all_by_connection
from app.utils import withdraw_chips_from_game

dynamodb = boto3.client("dynamodb")


def handle(event, context):
    connectionId = event["requestContext"]["connectionId"]
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
        withdraw_chips_from_game(connectionId, bankroll, user_token, gid)

    dynamodb.delete_item(
        TableName=os.environ["POKER_TABLE_NAME"],
        Key={
            "PK": {"S": connectionId},
            "SK": {"S": connectionId},
        },
    )

    return {}
