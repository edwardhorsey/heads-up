import simplejson as json 
import boto3
import os
import asyncio
import uuid

dynamodb = boto3.resource('dynamodb')
table_connections = dynamodb.Table(os.environ['POKER_CONNECTIONS_TABLE_NAME'])
table_games = dynamodb.Table(os.environ['POKER_GAMES_TABLE_NAME'])
table_past_games = dynamodb.Table(os.environ['POKER_PAST_GAMES_TABLE_NAME'])

from .poker.game import Game
from .poker.player import Player

# Utils

def get_display_name(connectionId):
    user = table_connections.get_item(Key={'connectionId': connectionId})
    return user['Item']['name'] if user else False

def generate_game_id():
    return uuid.uuid4().hex[:10]

def re_map_game(game):
    return Game.re_map(game)

def get_game(gid):
    game = table_games.get_item(Key={'gameId': gid})
    return re_map_game(game['Item']['game']) if game else False

def put_game(gid, game):
    return table_games.put_item(Item={'gameId': gid, 'game': game.self_dict()})





# Game functions
async def set_username(endpoint, connectionId, body):
    status = table_connections.put_item(Item={'connectionId': connectionId, 'name': body['username']})

    response = {
        'method': 'setUsername',
        'success': status,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )

async def create_game(endpoint, connectionId, body):
    gid = generate_game_id()

    display_name = get_display_name(connectionId)
    player_one = Player(connectionId, display_name, 1000)

    this_game = Game(gid, player_one)

    status = put_game(gid, this_game)

    response = {
        'method': 'createGame',
        'success': status,
        'gid': gid,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )

async def join_game(endpoint, connectionId, body):
    uid = connectionId
    gid = body['gid']
    # if not check_item_exists(gid):
        # return await incorrect_gid(uid, gid)
    this_game = get_game(gid)
    print(this_game)

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
            Data=json.dumps(response),
            ConnectionId=client
        )


def getBaseStats(request):
    gid = int(request['gid'])
    this_game = get_game(gid)
    return request['uid'], gid, (this_game.player_one.uid, this_game.player_two.uid), this_game


async def ready_to_play(endpoint, connectionId, body):
    # uid, gid, clients, this_game = getBaseStats(request)
    uid = connectionId
    gid = body['gid']
    this_game = get_game(gid)

    # util ? work out which player from uid
    if this_game.player_one.uid == uid and body['ready']:
        this_game.player_one_ready = True
    elif this_game.player_two.uid == uid and body['ready']:
        this_game.player_two_ready = True

    response = {
        'gid': gid,
        'number-of-rounds': this_game.number_of_rounds,
        'players': this_game.print_player_response()
    }

    clients = [this_game.player_one.uid, this_game.player_two.uid]

    if this_game.player_one_ready and this_game.player_two_ready:
        await new_hand(response, uid, gid, clients, this_game)
    else:
        response['method'] = 'onePlayerReady'
        put_game(gid, this_game)

        apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

        for client in clients:
            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response),
                ConnectionId=client
            )

# async def all_in(request):
#     uid, gid, clients, this_game = getBaseStats(request)
#     all_in_player = this_game.player_one if this_game.player_one.uid == uid else this_game.player_two
#     this_game.current_hand.all_in(all_in_player)
#     response = {
#         'method': 'all-in',
#         'uid': uid,
#         'gid': gid,
#         'action': 'one' if this_game.current_hand.dealer == 'two' else 'two',
#         'players': this_game.print_player_response(),
#         'pot': this_game.current_hand.pot
#     }
#     put_game(gid, this_game)
#     for client in clients:
#         await connected[client].send(json.dumps(response))

# async def call(request):
#     uid, gid, clients, this_game = getBaseStats(request)
#     calling_player = this_game.player_one if this_game.player_one.uid == uid else this_game.player_two
#     all_in_player = this_game.player_two if this_game.player_one.uid == uid else this_game.player_one
#     this_game.current_hand.call(calling_player, request['amount-to-call'], all_in_player) # deals community cards too and calculates winner
#     this_game.reset_players_bet_sizes()
#     response = {
#         'method': 'showdown',
#         'uid': uid,
#         'gid': gid,
#         'community-cards': this_game.current_hand.community,
#         'players': this_game.print_player_response(),
#         'pot': this_game.current_hand.pot
#     }
#     for client in clients:
#         await connected[client].send(json.dumps(response))
#     time.sleep(1)
#     this_game.current_hand.calculate_winner()
#     put_game(gid, this_game)
#     await send_winner_response(uid, gid, clients, this_game)

# async def fold(request):
#     uid, gid, clients, this_game = getBaseStats(request)
#     folding_player = 'one' if this_game.player_one.uid == uid else 'two'
#     this_game.current_hand.fold(folding_player, this_game.player_one, this_game.player_two)
#     response = {
#         'method': 'folded',
#         'uid': uid,
#         'gid': gid,
#         'players': this_game.print_player_response(),
#     }
#     if this_game.player_one.folded:
#         response['players'][0]['folded'] = True
#     elif this_game.player_two.folded:
#         response['players'][1]['folded'] = True
#     put_game(gid, this_game)
#     for client in clients:
#         await connected[client].send(json.dumps(response))
#     time.sleep(1)
#     await send_winner_response(uid, gid, clients, this_game)

# async def send_winner_response(uid, gid, clients, this_game):
#     this_game.current_hand.transfer_winnings(this_game.player_one, this_game.player_two)
#     response = {
#         'method': 'winner',
#         'uid': uid,
#         'gid': gid,
#         'winner': this_game.current_hand.winner,
#         'winning-hand': this_game.current_hand.winning_hand,
#         'pot': this_game.current_hand.pot,
#         'players': this_game.print_player_response(),
#     }
#     put_game(gid, this_game)
#     for client in clients:
#         await connected[client].send(json.dumps(response))
#     response['players'] = [ {
#             'uid': this_game.player_one.uid,
#             'name': this_game.player_one.name,
#             'ready': this_game.player_one_ready
#         }, {
#             'uid': this_game.player_two.uid,
#             'name': this_game.player_two.name,
#             'ready': this_game.player_two_ready
#         }
#     ]
#     if this_game.current_hand:
#         this_game.put_previous_hand()
#         this_game.current_hand = None
#     await new_hand(response, uid, gid, clients, this_game) ## need to turn into a client req ?

# async def new_hand(response, uid, gid, clients, this_game):
#     if this_game.player_one.bankroll > this_game.current_blind and this_game.player_two.bankroll > this_game.current_blind:
#         this_game.new_hand()
#         response.update({
#             'method': 'new-hand',
#             'number-of-hands': this_game.number_of_hands,
#             'stage': 'preflop',
#             'action': this_game.current_hand.dealer,
#             'pot': this_game.current_hand.pot,
#             'winner': this_game.current_hand.winner,
#             'winning-hand': this_game.current_hand.winning_hand,
#             'community': this_game.current_hand.community,
#             'players': this_game.print_player_response()
#         })
#         put_game(gid, this_game)
#         for client in clients:
#             if str(client) == response['players'][0]['uid']:
#                 response['players'][0]['hand'] = this_game.current_hand.one_cards
#                 response['players'][1]['hand'] = []
#             else:
#                 response['players'][0]['hand'] = []
#                 response['players'][1]['hand'] = this_game.current_hand.two_cards
#             await connected[client].send(json.dumps(response))
#     else:
#         response.update({
#             'method': 'player-bust',
#             'stage': 'end'
#         })
#         this_game.new_round()
#         put_game(gid, this_game)
#         for client in clients:
#             await connected[client].send(json.dumps(response))

# async def back_to_lobby(request):
#     uid = request['uid']
#     gid = int(request['gid'])
#     this_game = get_game(gid)
#     this_game.player_one = Player(this_game.player_one.uid, this_game.player_one.name, 1000)
#     this_game.player_two = Player(this_game.player_two.uid, this_game.player_two.name, 1000)
#     response = {
#         'method': 'back-to-lobby',
#         'uid': uid,
#         'gid': gid,
#         'stage': 'back-to-lobby',
#         'number-of-rounds': this_game.number_of_rounds,
#         'players': this_game.print_player_response()
#     }
#     response['players'][0]['hand'] = []
#     response['players'][1]['hand'] = []
#     put_game(gid, this_game)
#     await connected[uid].send(json.dumps(response))
