#!/usr/bin/env python

import asyncio
import websockets
import uuid
import json

connected = set()

def createUser(websocket):
    return (uuid.uuid4(), websocket)

def chat(message):
    return {

    }

async def echo(websocket, path):
    user = createUser(websocket)
    connected.add(user)

    try:
        async for message in websocket:
        
        
        
            for conn in connected:
                await conn[1].send(f"Hi {conn[0]} back from server: {message}")
    finally:
        # Unregister.
        connected.remove(user)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
