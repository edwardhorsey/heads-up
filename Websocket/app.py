#!/usr/bin/env python

import asyncio
import websockets
import uuid
import json
import time

from random import randrange
from game import Game
from player import Player

connected = {}
game_ids = set()
games = {}

def generate_GID():
    gid = randrange(1000)
    if gid not in game_ids:
        game_ids.add(gid)
        return gid
    else:
        return generate_GID()

def createUser():
    return uuid.uuid4()

async def chat(value):
    response = {
      'method': 'chat',
      'value': {
          'name': value['name'],
          'message': value['message'],
      }
    }
    for conn in connected:
        await connected[conn].send(json.dumps(response))

async def create_game(request):
    uid = uuid.UUID(request['uid'])
    gid = generate_GID()
    player_one = Player(uid, request['display-name'], 1000)
    games[gid] = Game(gid, player_one)
    response = {
        'method': 'create-game',
        'uid': str(uid),
        'gid': gid,
    }
    await connected[uid].send(json.dumps(response))

async def incorrect_gid(uid, gid):
    response = {
        'method': 'incorrect-gid',
        'uid': str(uid),
        'gid': gid
    }
    await connected[uid].send(json.dumps(response))

async def join_game(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    if gid not in games:
        return await incorrect_gid(uid, gid)
    player_two = Player(uid, request['display-name'], 1000)
    games[gid].add_player(player_two)
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    response = {
      'method': 'joined-game',
      'uid': str(uid),
      'gid': gid,
      'number-of-rounds': games[gid].number_of_rounds,
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll
        }
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

async def ready_to_play(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    if games[gid].player_one.uid == uid and request['ready']:
        games[gid].player_one_ready = True
    elif games[gid].player_two.uid == uid and request['ready']:
        games[gid].player_two_ready = True 
    response = {
      'uid': str(uid),
      'gid': gid,
      'number-of-rounds': games[gid].number_of_rounds,
      'number-of-hands': 0,
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'ready': games[gid].player_one_ready,
          'rounds-won': games[gid].one_rounds_won
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'ready': games[gid].player_two_ready,
          'rounds-won': games[gid].two_rounds_won
        }
      ]
    }
    if games[gid].player_one_ready and games[gid].player_two_ready:
        await new_hand(response, uid, gid, clients)
    else:
        response['method'] = 'one-player-ready'
        for client in clients:
            await connected[client].send(json.dumps(response))

async def all_in(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    all_in_player = games[gid].player_one if games[gid].player_one.uid == uid else games[gid].player_two
    games[gid].current_hand.all_in(all_in_player)
    response = {
      'method': 'all-in',
      'uid': str(uid),
      'gid': gid,
      'action': 'one' if games[gid].current_hand.dealer == 'two' else 'two',
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll,
          'bet-size': games[gid].player_one.bet_size
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll,
          'bet-size': games[gid].player_two.bet_size
        }
      ],
      'pot': games[gid].current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

async def call(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    calling_player = games[gid].player_one if games[gid].player_one.uid == uid else games[gid].player_two
    games[gid].current_hand.call(calling_player, request['amount-to-call']) # deals community cards too and calculates winner
    response = {
      'method': 'showdown',
      'uid': str(uid),
      'gid': gid,
      'community-cards': games[gid].current_hand.community,
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll,
          'hand': games[gid].current_hand.one_cards,
          'bet-size': 0
          }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll,
          'hand': games[gid].current_hand.two_cards,
          'bet-size': 0
        }
      ],
      'pot': games[gid].current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
    time.sleep(1)
    games[gid].current_hand.calculate_winner()
    await send_winner_response(uid, gid, clients)

async def fold(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    folding_player = 'one' if games[gid].player_one.uid == uid else 'two'
    games[gid].current_hand.fold(folding_player, games[gid].player_one, games[gid].player_two)
    response = {
      'method': 'folded',
      'uid': str(uid),
      'gid': gid,
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll
        }
      ]
    }
    if games[gid].player_one.folded:
        response['players'][0]['folded'] = True
    elif games[gid].player_two.folded:
        response['players'][1]['folded'] = True
    for client in clients:
        await connected[client].send(json.dumps(response))
    time.sleep(1)
    await send_winner_response(uid, gid, clients)

async def send_winner_response(uid, gid, clients):
    games[gid].current_hand.transfer_winnings(games[gid].player_one, games[gid].player_two)
    response = {
        'method': 'winner',
        'uid': str(uid),
        'gid': gid,
        'winner': games[gid].current_hand.winner,
        'winning-hand': games[gid].current_hand.winning_hand,
        'pot': games[gid].current_hand.pot,
        'players': [ {
            'uid': str(games[gid].player_one.uid),
            'name': games[gid].player_one.name,
            'bankroll': games[gid].player_one.bankroll,
            'profit': games[gid].current_hand.one_hand_profit,
            'rounds-won': games[gid].one_rounds_won
          }, {
            'uid': str(games[gid].player_two.uid),
            'name': games[gid].player_two.name,
            'bankroll': games[gid].player_two.bankroll,
            'profit': games[gid].current_hand.two_hand_profit,
            'rounds-won': games[gid].two_rounds_won
          }
        ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
    response['players'] = [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'ready': games[gid].player_one_ready
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'ready': games[gid].player_two_ready
        }
      ]
    await new_hand(response, uid, gid, clients) ## need to turn into a client req...

async def new_hand(response, uid, gid, clients):
    if games[gid].player_one.bankroll > games[gid].current_blind and games[gid].player_two.bankroll > games[gid].current_blind:
        games[gid].new_hand()
        response.update({
          'method': 'new-hand',
          'number-of-hands': games[gid].number_of_hands,
          'stage': 'preflop',
          'action': games[gid].current_hand.dealer,
          'pot': games[gid].current_hand.pot,
          'winner': games[gid].current_hand.winner,
          'community': games[gid].current_hand.community
        })
        response['players'][0]['bet-size'] = games[gid].player_one.bet_size
        response['players'][0]['bankroll'] = games[gid].player_one.bankroll
        response['players'][0]['folded'] = games[gid].player_one.folded
        response['players'][1]['bet-size'] = games[gid].player_two.bet_size
        response['players'][1]['bankroll'] = games[gid].player_two.bankroll
        response['players'][1]['folded'] = games[gid].player_one.folded
        for client in clients:
            if str(client) == response['players'][0]['uid']:
                response['players'][0]['hand'] = games[gid].current_hand.one_cards
                response['players'][1]['hand'] = False
            else:
                response['players'][0]['hand'] = False
                response['players'][1]['hand'] = games[gid].current_hand.two_cards
            await connected[client].send(json.dumps(response))
    else:
        response.update({
          'method': 'player-bust',
          'stage': 'end'
        })
        games[gid].new_round()
        for client in clients:
            await connected[client].send(json.dumps(response))

async def back_to_lobby(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    games[gid].player_one = Player(games[gid].player_one.uid, games[gid].player_one.name, 1000)
    games[gid].player_two = Player(games[gid].player_two.uid, games[gid].player_two.name, 1000)
    response = {
        'method': 'back-to-lobby',
        'uid': str(uid),
        'gid': gid,
        'number-of-rounds': games[gid].number_of_rounds,
        'players': [ {
            'uid': str(games[gid].player_one.uid), 
            'name': games[gid].player_one.name,
            'bankroll': games[gid].player_one.bankroll,
            'hand': False,
            'ready': games[gid].player_one_ready,
            'rounds-won': games[gid].one_rounds_won
          }, {
            'uid': str(games[gid].player_two.uid),
            'name': games[gid].player_two.name,
            'bankroll': games[gid].player_two.bankroll,
            'hand': False,
            'ready': games[gid].player_two_ready,
            'rounds-won': games[gid].two_rounds_won
          }
        ]
    }
    await connected[uid].send(json.dumps(response))


## running the server ##

async def echo(websocket, path):
    uid = createUser()
    connected[uid] = websocket
    first_send = {
      'method': 'connected',
      'uid': str(uid)
    }
    await websocket.send(json.dumps(first_send))

    try:
        async for message in websocket:
            request = json.loads(message)
            if request['method'] == 'chat':
                await chat(request['value'])
            if request['method'] == 'create-game':
                await create_game(request)
            if request['method'] == 'join-game':
                await join_game(request)
            if request['method'] == 'ready-to-play':
                await ready_to_play(request)
            if request['method'] == 'all-in':
                await all_in(request)
            if request['method'] == 'call':
                await call(request)
            if request['method'] == 'fold':
                await fold(request)
            if request['method'] == 'back-to-lobby':
                await back_to_lobby(request)


    finally:
        # Unregister.
        connected.pop(uid)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
