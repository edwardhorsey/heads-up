import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    connectionId = event['requestContext']['connectionId']

    # Insert the Id and default name of the connected user to the database
    dynamodb.put_item(TableName=os.environ['SOCKET_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': ''}})

    return {}