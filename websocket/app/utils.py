import uuid

from .tables import table_connections
from .tables import table_games
from .tables import table_past_games

from .poker.game import Game

def put_display_name(connectionId, name):
    return table_connections.put_item(Item={'connectionId': connectionId, 'name': name})

def get_display_name(connectionId):
    user = table_connections.get_item(Key={'connectionId': connectionId})
    return user['Item']['name'] if user else False

def generate_game_id():
    return uuid.uuid4().hex[:10]

def re_map_game(game):
    return Game.re_map(game)

def put_game(gid, game):
    return table_games.put_item(Item={'gameId': gid, 'game': game.self_dict()})

def get_game(gid):
    game = table_games.get_item(Key={'gameId': gid})
    return re_map_game(game['Item']['game']) if game else False
