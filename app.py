#!/usr/bin/env python

import asyncio
import websockets

connected = set()

async def echo(websocket, path):
    connected.add(websocket)

    try:
        async for message in websocket:
            for conn in connected:
                await conn.send(f"hi back from server. {message}")
    finally:
        # Unregister.
        connected.remove(websocket)

start_server = websockets.serve(echo, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

connected = set()
