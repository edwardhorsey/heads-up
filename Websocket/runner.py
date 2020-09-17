import asyncio

from App.app import start_server

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()