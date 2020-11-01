import asyncio
import json
import websockets

from App.app import connected
from App.app import createUser

from App.app import chat
from App.app import create_game
from App.app import join_game
from App.app import ready_to_play
from App.app import all_in
from App.app import call
from App.app import fold
from App.app import back_to_lobby

import boto3

users_table_name = 'heads-up-poker-users'
users_primary_column = 'connectUsers'
database = boto3.resource('dynamodb', 'eu-west-1')
users_table = database.Table(users_table_name)

## running the server ##

async def echo(websocket, path):
    uid = createUser()
    new_item = {'connectedUIDs': uid}
    users_table.put_item(Item=new_item)

    connected[uid] = websocket
    first_send = {
      'method': 'connected',
      'uid': uid
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
        users_table.delete_item(Key=new_item)
        connected.pop(uid)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()