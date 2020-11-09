import boto3

users_table_name = 'heads-up-poker-users'
users_primary_column = 'connectUsers'
games_table_name = 'heads_up_poker_games'
games_primary_column = 'gameId'
database = boto3.resource('dynamodb', 'eu-west-1')

games_table = database.Table(games_table_name)
users_table = database.Table(users_table_name)