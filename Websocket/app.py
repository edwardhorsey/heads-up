#!/usr/bin/env python

import asyncio
import websockets
import uuid
import json

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
    player_one = Player(uid, request['display-name'], 750)
    games[gid] = Game(gid, player_one)
    print(games)
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
    player_two = Player(uid, request['display-name'], 750)
    games[gid].add_player(player_two)
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    response = {
      'method': 'joined-game',
      'uid': str(uid),
      'gid': gid,
      'uids': [str(client) for client in clients],
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
      'uids': [str(client) for client in clients],
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'ready': True if games[gid].player_one_ready else False
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'ready': True if games[gid].player_two_ready else False
        }
      ]
    }
    if games[gid].player_one_ready and games[gid].player_two_ready:
        games[gid].new_hand()
        response.update({
          'method': 'new-hand',
          'number-of-hands': games[gid].number_of_hands,
          'stage': 'preflop',
          'action': games[gid].current_hand.dealer,
          'pot': games[gid].current_hand.pot
        })
        response['players'][0]['blind'] = games[gid].current_hand.p_one_blind
        response['players'][0]['bankroll'] = games[gid].player_one.bankroll
        response['players'][1]['blind'] = games[gid].current_hand.p_two_blind
        response['players'][1]['bankroll'] = games[gid].player_two.bankroll
        for client in clients:
            if str(client) == response['players'][0]['uid']:
                response['players'][0]['hand'] = games[gid].current_hand.one_cards
                response['players'][1]['hand'] = False
            else:
                response['players'][0]['hand'] = False
                response['players'][1]['hand'] = games[gid].current_hand.two_cards
            await connected[client].send(json.dumps(response))
    else:
        response['method'] = 'one-player-ready'
        for client in clients:
            await connected[client].send(json.dumps(response))

async def all_in(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    games[gid].all_in(uid)
    response = {
      'method': 'all-in',
      'uid': str(uid),
      'gid': gid,
      'uids': [str(client) for client in clients],
      'action': 'one' if games[gid].current_hand.dealer == 'two' else 'two',
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll
        }
      ],
      'pot': games[gid].current_hand.pot,
      'amount-to-call': games[gid].current_hand.all_in_amount,
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

async def call(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    games[gid].current_hand.run_cards()
    response = {
      'method': 'showdown',
      'uid': str(uid),
      'gid': gid,
      'uids': [str(client) for client in clients],
      'community-cards': games[gid].current_hand.community,
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll,
          'hand': games[gid].current_hand.one_cards
          }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll,
          'hand': games[gid].current_hand.two_cards
        }
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

async def fold(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    games[gid].fold(uid)
    response = {
      'method': 'folded',
      'uid': str(uid),
      'gid': gid,
      'uids': [str(client) for client in clients],
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll,
        }
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

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


    finally:
        # Unregister.
        connected.pop(uid)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
