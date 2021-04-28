import os
import uuid
import requests
from boto3.dynamodb.conditions import Key
from .tables import poker_table
from .cognito import lambda_handler as decode_token
from .poker.game import Game


def get_display_name(connectionId):
    user = poker_table.query(
        IndexName="connectionId",
        KeyConditionExpression=Key("connectionIdPK").eq(connectionId),
        Limit=1,
    )
    return (
        user["Items"][0]["displayName"]
        if ("Items" in user and user["Items"])
        else False
    )


def first_visit_put_user_details(connectionId, user_details, starting_bankroll):
    item = {
        "PK": user_details["sub"],
        "SK": user_details["sub"],
        "displayName": user_details["cognito:username"],
        "email": user_details["email"],
        "userTokenPK": user_details["sub"],
        "userTokenSK": "User",
        "userDetails": user_details,
        "bankroll": starting_bankroll,
    }
    poker_table.put_item(Item=item)
    return item


def get_user_by_user_token(user_token):
    user = poker_table.get_item(Key={"PK": user_token, "SK": user_token})
    return user["Item"] if "Item" in user else False


def get_user_by_connection(connectionId):
    user = poker_table.query(
        IndexName="connectionId",
        KeyConditionExpression=Key("connectionIdPK").eq(connectionId),
        Limit=1,
    )
    return user["Items"][0] if ("Items" in user and user["Items"]) else False


def save_user_token_to_connection(connectionId, user_token):
    return poker_table.put_item(
        Item={
            "PK": connectionId,
            "SK": connectionId,
            "userTokenPK": user_token,
            "userTokenSK": "Connection",
        }
    )


def save_connection_id_to_user(connectionId, user_token):
    return poker_table.update_item(
        Key={
            "PK": user_token,
            "SK": user_token,
        },
        UpdateExpression="SET connectionIdPK = :pk , connectionIdSK = :sk",
        ExpressionAttributeValues={
            ":pk": connectionId,
            ":sk": "User",
        },
    )


def save_game_id_to_connection_id(gameId, connectionId):
    return poker_table.update_item(
        Key={
            "PK": connectionId,
            "SK": connectionId,
        },
        UpdateExpression="SET gameIdPK = :pk , gameIdSK = :sk",
        ExpressionAttributeValues={
            ":pk": gameId,
            ":sk": "Connection",
        },
    )


def log_user_in(connectionId, user_token):
    if save_user_token_to_connection(
        connectionId, user_token
    ) and save_connection_id_to_user(connectionId, user_token):
        print(
            f"User with token '{user_token}' logged in on ConnectionId '{connectionId}'"
        )
        return True
    else:
        return False


def remove_user_details(connectionIds):
    print(f"Removing user token from following connections: {connectionIds}")
    for connectionId in connectionIds:
        poker_table.update_item(
            Key={
                "PK": connectionId,
                "SK": connectionId,
            },
            UpdateExpression="REMOVE userTokenPK, userTokenSK",
        )


def check_if_user_token_exists(user_token):
    result = poker_table.query(
        IndexName="userToken",
        KeyConditionExpression=Key("userTokenPK").eq(user_token)
        & Key("userTokenSK").eq("Connection"),
    )
    return result["Items"] if result["Items"] else False


def update_user_bankroll(user_token, new_bankroll):
    print("updating bankroll:", user_token, new_bankroll)

    return poker_table.update_item(
        Key={
            "PK": user_token,
            "SK": user_token,
        },
        UpdateExpression="SET bankroll = :br",
        ExpressionAttributeValues={
            ":br": new_bankroll,
        },
    )


def generate_game_id():
    return uuid.uuid4().hex[:10]


def re_map_game(game):
    return Game.re_map(game)


def put_game(gid, game):
    return poker_table.put_item(
        Item={
            "PK": gid,
            "SK": gid,
            "game": game.self_dict(),
            "gameIdPK": gid,
            "gameIdSK": "game",
        }
    )


def get_game(gid):
    game = poker_table.get_item(
        Key={
            "PK": gid,
            "SK": gid,
        }
    )
    return re_map_game(game["Item"]["game"]) if "Item" in game else False


def get_game_by_user_token(connectionId):
user = poker_table.query(
    IndexName="connectionId",
    KeyConditionExpression=Key("connectionIdPK").eq(connectionId),
    Limit=1,
)
return (
    user["Items"][0]["displayName"]
    if ("Items" in user and user["Items"])
    else False
)


async def get_access_tokens(code):
    url = os.environ["AWS_COGNITO_APP_URL"]
    app_client_id = os.environ["AWS_COGNITO_APP_CLIENT_ID"]
    redirect_uri = (
        "http://localhost:3000/logging-in/"
        if "IS_OFFLINE" in os.environ
        else (os.environ["AWS_COGNITO_APP_REDIRECT_URI"])
    )

    return requests.post(
        url + "/oauth2/token",
        {
            "Content-Type": "application/x-www-form-urlencoded",
            "grant_type": "authorization_code",
            "client_id": app_client_id,
            "code": code,
            "redirect_uri": redirect_uri,
        },
    ).json()


async def get_user_cognito_profile(code):
    try:
        access_tokens = await get_access_tokens(code)
        if "error" in access_tokens:
            raise Exception(
                "Failed to fetch from AWS Cognito oauth endpoint: ", access_tokens
            )
        else:
            if "id_token" in access_tokens:
                event = {"token": access_tokens["id_token"]}
                decoded_user = await decode_token(event, None)
                return decoded_user
            else:
                return False
    except Exception as error:
        print(error)
        return False
