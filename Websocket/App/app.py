#!/usr/bin/env python

import asyncio
import uuid
import json
import time

import jsonpickle
import boto3

from random import randrange
from .Poker.game import Game
from .Poker.player import Player

games_table_name = 'heads_up_poker_games'
games_primary_column = 'gameId'
database = boto3.resource('dynamodb', 'eu-west-1')
games_table = database.Table(games_table_name)

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

def put_game(gid, game):
    game_dict = game.self_dict()
    item = {
        'gameId': gid,
        'game': game_dict
    }
    games_table.put_item(Item=item)

def get_game(gid):
    game = games_table.get_item(Key={'gameId': gid})
    return game

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
    this_game = Game(gid, player_one)
    put_game(gid, this_game)
    # games[gid] = this_game ###### creating the game in DB for first time
    response = {
        'method': 'create-game',
        'uid': uid,
        'gid': gid,
    }
    put_game(gid, this_game)
    await connected[uid].send(json.dumps(response))

async def incorrect_gid(uid, gid):
    response = {
        'method': 'incorrect-gid',
        'uid': uid,
        'gid': gid
    }
    # put_game(gid, this_game)
    await connected[uid].send(json.dumps(response))

async def join_game(request):
    uid = request['uid']
    gid = int(request['gid'])
    this_game = get_game(gid)
    # if gid not in games:
    #     return await incorrect_gid(uid, gid)
    player_two = Player(uid, request['display-name'], 1000)
    this_game.add_player(player_two)
    clients = (this_game.player_one.uid, this_game.player_two.uid)
    response = {
      'method': 'joined-game',
      'uid': uid,
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
      ]
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
        put_game(gid, this_game)

def getBaseStats(request):
    gid = int(request['gid'])
    this_game = get_game(gid)
    return request['uid'], gid, (this_game.player_one.uid, this_game.player_two.uid), this_game

async def ready_to_play(request):
    uid, gid, clients, this_game = getBaseStats(request)
    if this_game.player_one.uid == uid and request['ready']:
        this_game.player_one_ready = True
    elif this_game.player_two.uid == uid and request['ready']:
        this_game.player_two_ready = True 
    response = {
      'uid': uid,
      'gid': gid,
      'number-of-rounds': this_game.number_of_rounds,
      'number-of-hands': 0,
      'players': [ {
          'uid': this_game.player_one.uid,
          'name': this_game.player_one.name,
          'ready': this_game.player_one_ready,
          'rounds-won': this_game.one_rounds_won
        }, {
          'uid': this_game.player_two.uid,
          'name': this_game.player_two.name,
          'ready': this_game.player_two_ready,
          'rounds-won': this_game.two_rounds_won
        }
      ]
    }
    if this_game.player_one_ready and this_game.player_two_ready:
        await new_hand(response, uid, gid, clients, this_game)
    else:
        response['method'] = 'one-player-ready'
        for client in clients:
            await connected[client].send(json.dumps(response))
            put_game(gid, this_game)

async def all_in(request):
    uid, gid, clients, this_game = getBaseStats(request)
    all_in_player = this_game.player_one if this_game.player_one.uid == uid else this_game.player_two
    this_game.current_hand.all_in(all_in_player)
    response = {
      'method': 'all-in',
      'uid': uid,
      'gid': gid,
      'action': 'one' if this_game.current_hand.dealer == 'two' else 'two',
      'players': this_game.print_player_response(),
      'pot': this_game.current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
        put_game(gid, this_game)

async def call(request):
    uid, gid, clients, this_game = getBaseStats(request)
    calling_player = this_game.player_one if this_game.player_one.uid == uid else this_game.player_two
    all_in_player = this_game.player_two if this_game.player_one.uid == uid else this_game.player_one
    this_game.current_hand.call(calling_player, request['amount-to-call'], all_in_player) # deals community cards too and calculates winner
    this_game.reset_players_bet_sizes()
    response = {
      'method': 'showdown',
      'uid': uid,
      'gid': gid,
      'community-cards': this_game.current_hand.community,
      'players': this_game.print_player_response(),
      'pot': this_game.current_hand.pot
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
        put_game(gid, this_game)
    time.sleep(1)
    this_game.current_hand.calculate_winner()
    await send_winner_response(uid, gid, clients, this_game)

async def fold(request):
    uid, gid, clients, this_game = getBaseStats(request)
    folding_player = 'one' if this_game.player_one.uid == uid else 'two'
    this_game.current_hand.fold(folding_player, this_game.player_one, this_game.player_two)
    response = {
      'method': 'folded',
      'uid': uid,
      'gid': gid,
      'players': this_game.print_player_response(),
    }
    if this_game.player_one.folded:
        response['players'][0]['folded'] = True
    elif this_game.player_two.folded:
        response['players'][1]['folded'] = True
    for client in clients:
        await connected[client].send(json.dumps(response))
        put_game(gid, this_game)
    time.sleep(1)
    await send_winner_response(uid, gid, clients, this_game)

async def send_winner_response(uid, gid, clients, this_game):
    this_game.current_hand.transfer_winnings(this_game.player_one, this_game.player_two)
    put_game(gid, this_game)
    response = {
        'method': 'winner',
        'uid': uid,
        'gid': gid,
        'winner': this_game.current_hand.winner,
        'winning-hand': this_game.current_hand.winning_hand,
        'pot': this_game.current_hand.pot,
        'players': this_game.print_player_response(),
    }
    for client in clients:
        await connected[client].send(json.dumps(response))
        put_game(gid, this_game)
    response['players'] = [ {
          'uid': this_game.player_one.uid,
          'name': this_game.player_one.name,
          'ready': this_game.player_one_ready
        }, {
          'uid': this_game.player_two.uid,
          'name': this_game.player_two.name,
          'ready': this_game.player_two_ready
        }
      ]
    await new_hand(response, uid, gid, clients, this_game) ## need to turn into a client req ?

async def new_hand(response, uid, gid, clients, this_game):
    if this_game.player_one.bankroll > this_game.current_blind and this_game.player_two.bankroll > this_game.current_blind:
        this_game.new_hand()
        response.update({
          'method': 'new-hand',
          'number-of-hands': this_game.number_of_hands,
          'stage': 'preflop',
          'action': this_game.current_hand.dealer,
          'pot': this_game.current_hand.pot,
          'winner': this_game.current_hand.winner,
          'winning-hand': this_game.current_hand.winning_hand,
          'community': this_game.current_hand.community,
          'players': this_game.print_player_response()
        })
        for client in clients:
            if str(client) == response['players'][0]['uid']:
                response['players'][0]['hand'] = this_game.current_hand.one_cards
                response['players'][1]['hand'] = []
            else:
                response['players'][0]['hand'] = []
                response['players'][1]['hand'] = this_game.current_hand.two_cards
            await connected[client].send(json.dumps(response))
            put_game(gid, this_game)
    else:
        response.update({
          'method': 'player-bust',
          'stage': 'end'
        })
        this_game.new_round()
        for client in clients:
            await connected[client].send(json.dumps(response))
            put_game(gid, this_game)

async def back_to_lobby(request):
    uid = request['uid']
    gid = int(request['gid'])
    this_game = get_game(gid)
    this_game.player_one = Player(this_game.player_one.uid, this_game.player_one.name, 1000)
    this_game.player_two = Player(this_game.player_two.uid, this_game.player_two.name, 1000)
    response = {
        'method': 'back-to-lobby',
        'uid': uid,
        'gid': gid,
        'number-of-rounds': this_game.number_of_rounds,
        'players': this_game.print_player_response()
    }
    response['players'][0]['hand'] = []
    response['players'][1]['hand'] = []
    await connected[uid].send(json.dumps(response))
    put_game(gid, this_game)
