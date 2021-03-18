import simplejson as json 
import asyncio
import uuid
import time
import os
import boto3

from .utils import put_display_name
from .utils import get_display_name
from .utils import generate_game_id
from .utils import re_map_game
from .utils import get_game
from .utils import put_game

from .poker.game import Game
from .poker.player import Player

# Game functions

# Set username
async def set_username(endpoint, connectionId, body):
    status = put_display_name(connectionId, body['username'])

    response = {
        'method': 'setUsername',
        'uid': connectionId,
        'username': body['username'],
        'success': status,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data = json.dumps(response),
        ConnectionId = connectionId
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
        'method': 'createGame',
        'success': status,
        'gid': gid,
        'uid': uid,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data = json.dumps(response),
        ConnectionId = connectionId
    )

# Join game
async def join_game(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    # if not check_item_exists(gid):
        # return await incorrect_gid(uid, gid)
    this_game = get_game(gid)

    display_name = get_display_name(uid)
    player_two = Player(uid, display_name, 1000)
    this_game.add_player(player_two)
    
    status = put_game(gid, this_game)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    response = {
        'method': 'joinGame',
        'gid': gid,
        'number-of-rounds': this_game.number_of_rounds,
        'players': [ {
            'uid': this_game.player_one.uid,
            'name': this_game.player_one.name,
            'bankroll': this_game.player_one.bankroll
        }, {
            'uid': this_game.player_two.uid,
            'name': this_game.player_two.name,
            'bankroll': this_game.player_two.bankroll
        }
        ],
        'status': status,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data = json.dumps(response),
            ConnectionId = client
        )

# Ready to play
async def ready_to_play(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    # util ? work out which player from uid
    if this_game.player_one.uid == uid and body['ready']:
        this_game.player_one_ready = True
    elif this_game.player_two.uid == uid and body['ready']:
        this_game.player_two_ready = True

    response = {
        'uid': uid,
        'gid': gid,
        'number-of-rounds': this_game.number_of_rounds,
        'players': this_game.print_player_response()
    }

    clients = [this_game.player_one.uid, this_game.player_two.uid]

    if this_game.player_one_ready and this_game.player_two_ready:
        await new_hand(endpoint, connectionId, body, this_game, response)
    else:
        response['method'] = 'onePlayerReady'
        put_game(gid, this_game)

        apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data = json.dumps(response),
                ConnectionId = client
            )

# New hand
async def new_hand(endpoint, connectionId, body, this_game, response):
    uid = connectionId
    gid = body['gid']

    clients = [this_game.player_one.uid, this_game.player_two.uid]   
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    if this_game.player_one.bankroll > this_game.current_blind and this_game.player_two.bankroll > this_game.current_blind:
        this_game.new_hand()

        response.update({
            'method': 'newHand',
            'number-of-hands': this_game.number_of_hands,
            'stage': 'preflop',
            'action': this_game.current_hand.dealer,
            'pot': this_game.current_hand.pot,
            'winner': this_game.current_hand.winner,
            'winning-hand': this_game.current_hand.winning_hand,
            'community': this_game.current_hand.community,
            'players': this_game.print_player_response()
        })

        put_game(gid, this_game)

        for client in clients:
            if client == response['players'][0]['uid']:
                response['players'][0]['hand'] = this_game.current_hand.one_cards
                response['players'][1]['hand'] = []
            else:
                response['players'][0]['hand'] = []
                response['players'][1]['hand'] = this_game.current_hand.two_cards
            
            apigatewaymanagementapi.post_to_connection(
                Data = json.dumps(response),
                ConnectionId = client
            )
    else:
        response.update({
            'method': 'playerBust',
            'stage': 'end'
        })

        this_game.new_round()
        put_game(gid, this_game)

        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data = json.dumps(response),
                ConnectionId = client
            )

# All in
async def all_in(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]   
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)
    
    all_in_player = this_game.player_one if this_game.player_one.uid == uid else this_game.player_two
    this_game.current_hand.all_in(all_in_player)

    response = {
        'method': 'allIn',
        'uid': uid,
        'gid': gid,
        'action': 'one' if this_game.current_hand.dealer == 'two' else 'two',
        'players': this_game.print_player_response(),
        'pot': this_game.current_hand.pot
    }

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data = json.dumps(response),
            ConnectionId = client
        )

# Fold
async def fold(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    folding_player = 'one' if this_game.player_one.uid == uid else 'two'
    this_game.current_hand.fold(folding_player, this_game.player_one, this_game.player_two)
    response = {
        'method': 'folded',
        'uid': uid,
        'gid': gid,
        'players': this_game.print_player_response(),
    }

    if this_game.player_one.folded:
        response['players'][0]['folded'] = True
    elif this_game.player_two.folded:
        response['players'][1]['folded'] = True

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data = json.dumps(response),
            ConnectionId = client
        )

    time.sleep(2)
    await send_winner_response(endpoint, connectionId, body, this_game)

# Call
async def call(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    if this_game.player_one.uid == uid:
        calling_player = this_game.player_one
        all_in_player = this_game.player_two
    else:
        calling_player = this_game.player_two
        all_in_player = this_game.player_one

    # deals community cards too and calculates winner
    this_game.current_hand.call(calling_player, body['amount-to-call'], all_in_player)
    this_game.reset_players_bet_sizes()

    response = {
        'method': 'showdown',
        'uid': uid,
        'gid': gid,
        'community-cards': this_game.current_hand.community,
        'players': this_game.print_player_response(),
        'pot': this_game.current_hand.pot
    }

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data = json.dumps(response),
            ConnectionId = client
        )

    time.sleep(2)
    this_game.current_hand.calculate_winner()

    put_game(gid, this_game)

    await send_winner_response(endpoint, connectionId, body, this_game)

# Send winner response
async def send_winner_response(endpoint, connectionId, body, this_game):
    uid = connectionId
    gid = body['gid']
    this_game.current_hand.transfer_winnings(this_game.player_one, this_game.player_two)

    clients = [this_game.player_one.uid, this_game.player_two.uid]
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    response = {
        'method': 'winner',
        'uid': uid,
        'gid': gid,
        'winner': this_game.current_hand.winner,
        'winning-hand': this_game.current_hand.winning_hand,
        'pot': this_game.current_hand.pot,
        'players': this_game.print_player_response(),
    }

    put_game(gid, this_game)

    for client in clients:
        apigatewaymanagementapi.post_to_connection(
            Data = json.dumps(response),
            ConnectionId = client
        )

    response['players'] = [{
        'uid': this_game.player_one.uid,
        'name': this_game.player_one.name,
        'ready': this_game.player_one_ready
    }, {
        'uid': this_game.player_two.uid,
        'name': this_game.player_two.name,
        'ready': this_game.player_two_ready
    }]

    if this_game.current_hand:
        # this_game.put_previous_hand()
        this_game.current_hand = None

    await new_hand(endpoint, connectionId, body, this_game, response) ## need to turn into a client req ?

# Back to lobby
async def back_to_lobby(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    if this_game.player_one.uid == uid:
        this_game.player_one = Player(this_game.player_one.uid, this_game.player_one.name, 1000)
    else:
        this_game.player_two = Player(this_game.player_two.uid, this_game.player_two.name, 1000)

    response = {
        'method': 'backToLobby',
        'uid': uid,
        'gid': gid,
        'stage': 'backToLobby',
        'number-of-rounds': this_game.number_of_rounds,
        'players': this_game.print_player_response()
    }

    response['players'][0]['hand'] = []
    response['players'][1]['hand'] = []

    put_game(gid, this_game)

    apigatewaymanagementapi.post_to_connection(
        Data = json.dumps(response),
        ConnectionId = uid
    )
