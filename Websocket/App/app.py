#!/usr/bin/env python

import asyncio
import uuid
import json
import time
import jsonpickle

from random import randrange
from .Poker.game import Game
from .Poker.player import Player

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
    return str(uuid.uuid4())

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
    uid = request['uid']
    gid = generate_GID()
    player_one = Player(uid, request['display-name'], 1000)
    games[gid] = Game(gid, player_one)
    response = {
        'method': 'create-game',
        'uid': uid,
        'gid': gid,
    }
    await connected[uid].send(json.dumps(response))

async def incorrect_gid(uid, gid):
    response = {
        'method': 'incorrect-gid',
        'uid': uid,
        'gid': gid
    }
    await connected[uid].send(json.dumps(response))

async def join_game(request):
    uid = request['uid']
    gid = int(request['gid'])
    if gid not in games:
        return await incorrect_gid(uid, gid)
    player_two = Player(uid, request['display-name'], 1000)
    games[gid].add_player(player_two)
    clients = (games[gid].player_one.uid, games[gid].player_two.uid)
    response = {
      'method': 'joined-game',
      'uid': uid,
      'gid': gid,
      'number-of-rounds': games[gid].number_of_rounds,
      'players': [ {
          'uid': games[gid].player_one.uid,
          'name': games[gid].player_one.name,
          'bankroll': games[gid].player_one.bankroll
        }, {
          'uid': games[gid].player_two.uid,
          'name': games[gid].player_two.name,
          'bankroll': games[gid].player_two.bankroll
        }
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

def getBaseStats(request):
    gid = int(request['gid'])
    return request['uid'], gid, (games[gid].player_one.uid, games[gid].player_two.uid)

async def ready_to_play(request):
    uid, gid, clients = getBaseStats(request)
    if games[gid].player_one.uid == uid and request['ready']:
        games[gid].player_one_ready = True
    elif games[gid].player_two.uid == uid and request['ready']:
        games[gid].player_two_ready = True 
    response = {
      'uid': uid,
      'gid': gid,
      'number-of-rounds': games[gid].number_of_rounds,
      'number-of-hands': 0,
      'players': [ {
          'uid': games[gid].player_one.uid,
          'name': games[gid].player_one.name,
          'ready': games[gid].player_one_ready,
          'rounds-won': games[gid].one_rounds_won
        }, {
          'uid': games[gid].player_two.uid,
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
    uid, gid, clients = getBaseStats(request)
    all_in_player = games[gid].player_one if games[gid].player_one.uid == uid else games[gid].player_two
    games[gid].current_hand.all_in(all_in_player)
    response = {
      'method': 'all-in',
      'uid': uid,
      'gid': gid,
      'action': 'one' if games[gid].current_hand.dealer == 'two' else 'two',
      'players': games[gid].print_player_response(),
      'pot': games[gid].current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))

async def call(request):
    uid, gid, clients = getBaseStats(request)
    calling_player = games[gid].player_one if games[gid].player_one.uid == uid else games[gid].player_two
    all_in_player = games[gid].player_two if games[gid].player_one.uid == uid else games[gid].player_one
    games[gid].current_hand.call(calling_player, request['amount-to-call'], all_in_player) # deals community cards too and calculates winner
    games[gid].reset_players_bet_sizes()
    response = {
      'method': 'showdown',
      'uid': uid,
      'gid': gid,
      'community-cards': games[gid].current_hand.community,
      'players': games[gid].print_player_response(),
      'pot': games[gid].current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
    time.sleep(1)
    games[gid].current_hand.calculate_winner()
    await send_winner_response(uid, gid, clients)

async def fold(request):
    uid, gid, clients = getBaseStats(request)
    folding_player = 'one' if games[gid].player_one.uid == uid else 'two'
    games[gid].current_hand.fold(folding_player, games[gid].player_one, games[gid].player_two)
    response = {
      'method': 'folded',
      'uid': uid,
      'gid': gid,
      'players': games[gid].print_player_response(),
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
    frozen = jsonpickle.encode(games[gid], unpicklable=False)
    print(frozen)
    response = {
        'method': 'winner',
        'uid': uid,
        'gid': gid,
        'winner': games[gid].current_hand.winner,
        'winning-hand': games[gid].current_hand.winning_hand,
        'pot': games[gid].current_hand.pot,
        'players': games[gid].print_player_response(),
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
    response['players'] = [ {
          'uid': games[gid].player_one.uid,
          'name': games[gid].player_one.name,
          'ready': games[gid].player_one_ready
        }, {
          'uid': games[gid].player_two.uid,
          'name': games[gid].player_two.name,
          'ready': games[gid].player_two_ready
        }
      ]
    await new_hand(response, uid, gid, clients) ## need to turn into a client req ?

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
          'winning-hand': games[gid].current_hand.winning_hand,
          'community': games[gid].current_hand.community,
          'players': games[gid].print_player_response()
        })
        for client in clients:
            if str(client) == response['players'][0]['uid']:
                response['players'][0]['hand'] = games[gid].current_hand.one_cards
                response['players'][1]['hand'] = []
            else:
                response['players'][0]['hand'] = []
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
    uid = request['uid']
    gid = int(request['gid'])
    games[gid].player_one = Player(games[gid].player_one.uid, games[gid].player_one.name, 1000)
    games[gid].player_two = Player(games[gid].player_two.uid, games[gid].player_two.name, 1000)
    response = {
        'method': 'back-to-lobby',
        'uid': uid,
        'gid': gid,
        'number-of-rounds': games[gid].number_of_rounds,
        'players': games[gid].print_player_response()
    }
    response['players'][0]['hand'] = []
    response['players'][1]['hand'] = []
    await connected[uid].send(json.dumps(response))
