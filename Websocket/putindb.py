import boto3
games_table_name = 'heads_up_poker_games'
games_primary_column = 'gameId'
database = boto3.resource('dynamodb', 'eu-west-1')
games_table = database.Table(games_table_name)


item = {
    'gameId': 1234,
}
games_table.put_item(Item=item)
