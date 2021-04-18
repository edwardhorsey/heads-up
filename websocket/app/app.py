import simplejson as json
import asyncio
import uuid
import time
import os
import boto3

from .utils import *
from .poker.game import Game
from .poker.player import Player

#
# Game functions
#
# Login
async def login(endpoint, connectionId, body):
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )
    failed_to_log_in = {
        "method": "login",
        "uid": connectionId,
        "userObject": False,
        "message": "Failed to log in",
    }

    authorization_code = body["code"]
    user_details = await get_user_profile(authorization_code)

    if user_details:
        players_already_using_token = check_if_user_token_exists(user_details["sub"])
        if players_already_using_token:
            players = [player["PK"] for player in players_already_using_token]
            remove_user_details(players)
            logout_response = {
                "method": "forceLogout",
                "uid": connectionId,
                "message": "Session invalidated: a more recent websocket connection has logged in using your account",
            }
            for client in players:
                try:
                    apigatewaymanagementapi.post_to_connection(
                        Data=json.dumps(logout_response), ConnectionId=client
                    )
                except Exception as error:
                    print("Error posting to kicked player's connectionId: ", error)

        if not check_if_user_exists(user_details["sub"]):
            first_visit_put_user_details(connectionId, user_details, 500)

        # save user_token and connectionId
        if log_user_in(connectionId, user_details["sub"]):
            response = {
                "method": "login",
                "uid": connectionId,
                "userObject": {
                    "authToken": user_details["sub"],
                    "displayName": user_details["cognito:username"],
                    "email": user_details["email"],
                },
                "message": "Logged in",
            }
        else:
            response = failed_to_log_in
    else:
        response = failed_to_log_in

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response), ConnectionId=connectionId
    )


# Set username
async def set_username(endpoint, connectionId, body):
    status = put_display_name(connectionId, body["username"])

    response = {
        "method": "setUsername",
        "uid": connectionId,
        "username": body["username"],
        "success": status,
    }

    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )
    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response), ConnectionId=connectionId
    )


# Create game
async def create_game(endpoint, connectionId, body):
    gid = generate_game_id()
    uid = connectionId

    display_name = get_display_name(connectionId)
    player_one = Player(connectionId, display_name, 1000)

    this_game = Game(gid, player_one)

    status = put_game(gid, this_game)

    response = {
        "method": "createGame",
        "success": status,
        "gid": gid,
    }

    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )
    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response), ConnectionId=connectionId
    )


# Join game
async def join_game(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    # if not check_item_exists(gid):
    # return await incorrect_gid(uid, gid)
    this_game = get_game(gid)

    display_name = get_display_name(uid)
    player_two = Player(uid, display_name, 1000)
    this_game.add_player(player_two)

    status = put_game(gid, this_game)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    response = {
        "method": "joinGame",
        "gid": gid,
        "number-of-rounds": this_game.number_of_rounds,
        "players": [
            {
                "uid": this_game.player_one.uid,
                "name": this_game.player_one.name,
                "bankroll": this_game.player_one.bankroll,
            },
            {
                "uid": this_game.player_two.uid,
                "name": this_game.player_two.name,
                "bankroll": this_game.player_two.bankroll,
            },
        ],
        "status": status,
    }

    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )
    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=client
        )


# Ready to play
async def ready_to_play(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    this_game = get_game(gid)

    # util ? work out which player from uid
    if this_game.player_one.uid == uid and body["ready"]:
        this_game.player_one_ready = True
    elif this_game.player_two.uid == uid and body["ready"]:
        this_game.player_two_ready = True

    response = {
        "gid": gid,
        "number-of-rounds": this_game.number_of_rounds,
        "players": this_game.print_player_response(),
    }

    clients = [this_game.player_one.uid, this_game.player_two.uid]

    if this_game.player_one_ready and this_game.player_two_ready:
        await new_hand(endpoint, connectionId, body, this_game, response)
    else:
        response["method"] = "onePlayerReady"
        put_game(gid, this_game)

        apigatewaymanagementapi = boto3.client(
            "apigatewaymanagementapi", endpoint_url=endpoint
        )
        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response), ConnectionId=client
            )


# New hand
async def new_hand(endpoint, connectionId, body, this_game, response):
    uid = connectionId
    gid = body["gid"]

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    if (
        this_game.player_one.bankroll > this_game.current_blind
        and this_game.player_two.bankroll > this_game.current_blind
    ):
        this_game.new_hand()

        response.update(
            {
                "method": "newHand",
                "number-of-hands": this_game.number_of_hands,
                "stage": "preflop",
                "action": this_game.current_hand.dealer,
                "pot": this_game.current_hand.pot,
                "winner": this_game.current_hand.winner,
                "winning-hand": this_game.current_hand.winning_hand,
                "community": this_game.current_hand.community,
                "players": this_game.print_player_response(),
            }
        )

        put_game(gid, this_game)

        for client in clients:
            if client == response["players"][0]["uid"]:
                response["players"][0]["hand"] = this_game.current_hand.one_cards
                response["players"][1]["hand"] = []
            else:
                response["players"][0]["hand"] = []
                response["players"][1]["hand"] = this_game.current_hand.two_cards

            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response), ConnectionId=client
            )
    else:
        response.update(
            {
                "method": "playerBust",
                "stage": "end",
                "players": this_game.print_player_response(),
            }
        )

        this_game.new_round()
        put_game(gid, this_game)

        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response), ConnectionId=client
            )


# All in
async def all_in(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    all_in_player = (
        this_game.player_one
        if this_game.player_one.uid == uid
        else this_game.player_two
    )
    this_game.current_hand.all_in(all_in_player)

    response = {
        "method": "allIn",
        "gid": gid,
        "action": "one" if this_game.current_hand.dealer == "two" else "two",
        "players": this_game.print_player_response(),
        "pot": this_game.current_hand.pot,
    }

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=client
        )


# Fold
async def fold(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    folding_player = "one" if this_game.player_one.uid == uid else "two"
    this_game.current_hand.fold(
        folding_player, this_game.player_one, this_game.player_two
    )
    response = {
        "method": "folded",
        "gid": gid,
        "players": this_game.print_player_response(),
    }

    if this_game.player_one.folded:
        response["players"][0]["folded"] = True
    elif this_game.player_two.folded:
        response["players"][1]["folded"] = True

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=client
        )

    time.sleep(2)
    await send_winner_response(endpoint, connectionId, body, this_game)


# Call
async def call(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    if this_game.player_one.uid == uid:
        calling_player = this_game.player_one
        all_in_player = this_game.player_two
    else:
        calling_player = this_game.player_two
        all_in_player = this_game.player_one

    # deals community cards too and calculates winner
    this_game.current_hand.call(calling_player, body["amount-to-call"], all_in_player)
    this_game.reset_players_bet_sizes()

    response = {
        "method": "showdown",
        "gid": gid,
        "community-cards": this_game.current_hand.community,
        "players": this_game.print_player_response(),
        "pot": this_game.current_hand.pot,
    }

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=client
        )

    time.sleep(2)
    this_game.current_hand.calculate_winner()

    put_game(gid, this_game)

    await send_winner_response(endpoint, connectionId, body, this_game)


# Send winner response
async def send_winner_response(endpoint, connectionId, body, this_game):
    uid = connectionId
    gid = body["gid"]
    this_game.current_hand.transfer_winnings(this_game.player_one, this_game.player_two)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    response = {
        "method": "winner",
        "gid": gid,
        "winner": this_game.current_hand.winner,
        "winning-hand": this_game.current_hand.winning_hand,
        "pot": this_game.current_hand.pot,
        "players": this_game.print_player_response(),
    }

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response), ConnectionId=client
        )

    response["players"] = [
        {
            "uid": this_game.player_one.uid,
            "name": this_game.player_one.name,
            "ready": this_game.player_one_ready,
        },
        {
            "uid": this_game.player_two.uid,
            "name": this_game.player_two.name,
            "ready": this_game.player_two_ready,
        },
    ]

    if this_game.current_hand:
        # this_game.put_previous_hand()
        this_game.current_hand = None

    await new_hand(
        endpoint, connectionId, body, this_game, response
    )  ## need to turn into a client req ?


# Back to lobby
async def back_to_lobby(endpoint, connectionId, body):
    uid = connectionId
    gid = body["gid"]
    this_game = get_game(gid)

    apigatewaymanagementapi = boto3.client(
        "apigatewaymanagementapi", endpoint_url=endpoint
    )

    if this_game.player_one.uid == uid:
        if this_game.player_one.bankroll == 0:
            this_game.player_one = Player(
                this_game.player_one.uid, this_game.player_one.name, 500
            )
    elif this_game.player_two.uid == uid:
        if this_game.player_two.bankroll == 0:
            this_game.player_two = Player(
                this_game.player_two.uid, this_game.player_two.name, 500
            )
    else:
        raise Exception("Player uid not in game", uid)

    response = {
        "method": "backToLobby",
        "uid": uid,
        "gid": gid,
        "stage": "backToLobby",
        "number-of-rounds": this_game.number_of_rounds,
        "players": this_game.print_player_response(),
    }

    response["players"][0]["hand"] = []
    response["players"][1]["hand"] = []

    put_game(gid, this_game)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response), ConnectionId=uid
    )
