#!/usr/bin/env python

import asyncio
import websockets
import uuid
import json

from random import randrange
from poker import Game, Player

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
          'username': value['username'],
          'message': value['message'],
      }
    }
    for conn in connected:
        await connected[conn].send(json.dumps(response))

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
                uid = uuid.UUID(request['uid'])
                gid = generate_GID()
                player_one = Player(uid, request['display-name'], 10000)
                games[gid] = Game(gid, player_one)
                response = {
                  'method': 'create-game',
                  'uid': str(uid),
                  'gid': gid,
                }
                await connected[uid].send(json.dumps(response))
                
        
    finally:
        # Unregister.
        connected.pop(uid)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
