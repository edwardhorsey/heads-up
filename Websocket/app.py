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
    player_one = Player(uid, request['display-name'], 10000)
    games[gid] = Game(gid, player_one)
    print(games)
    response = {
      'method': 'create-game',
      'uid': str(uid),
      'gid': gid,
    }
    await connected[uid].send(json.dumps(response))

async def join_game(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    player_two = Player(uid, request['display-name'], 10000)
    games[gid].add_player(player_two)
    clients = [games[gid].player_one.uid, games[gid].player_two.uid]
    response = {
      'method': 'joined-game',
      'uid': uid,
      'gid': gid,
      'uids': [str(client) for client in clients],
      'players': [ {
          'uid': str(games[gid].player_one.uid),
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll,
          'hand': False
        }, {
          'uid': str(games[gid].player_two.uid),
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll,
          'hand': False
        }
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

def ready_to_play(request):
    uid = uuid.UUID(request['uid'])
    gid = int(request['gid'])
    clients = [games[gid].player_one.uid, games[gid].player_two.uid]
    
    if games[gid].player_one.uid == uid:
        games[gid].player_one_ready = True
    elif games[gid].player_two.uid == uid:
        games[gid].player_two_ready = True
    print(gid, games[gid].player_one_ready, games[gid].player_two_ready)

    if games[gid].player_one_ready and games[gid].player_two_ready:
        games[gid].new_hand()
        # your_hand = 
        response = {
          'method': 'new-hand',
          'uid': uid,
          'gid': gid,
          'uids': [str(client) for client in clients],
          'number-of-hands': games[gid].number_of_hands,
          'players': [ {
              'uid': str(games[gid].player_one.uid),
              'name': games[gid].player_one.name,
              'bankroll': games[gid].player_one.bankroll,
              # 'hand': games[gid].current_hand.one
            }, {
              'uid': str(games[gid].player_two.uid),
              'name': games[gid].player_two.name,
              'bankroll': games[gid].player_two.bankroll,
              # 'hand': games[gid].current_hand.two
            }
          ]
        }


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

            

    finally:
        # Unregister.
        connected.pop(uid)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
