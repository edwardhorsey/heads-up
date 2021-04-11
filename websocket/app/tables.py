import os
import boto3

dynamodb = boto3.resource('dynamodb')
table_connections = dynamodb.Table(os.environ['POKER_CONNECTIONS_TABLE_NAME'])
table_games = dynamodb.Table(os.environ['POKER_GAMES_TABLE_NAME'])
table_past_games = dynamodb.Table(os.environ['POKER_PAST_GAMES_TABLE_NAME'])
poker_table = dynamodb.Table(os.environ['POKER_TABLE_NAME'])