import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    connectionId = event['requestContext']['connectionId']
    user_db_item = dynamodb.get_item(
        TableName=os.environ['POKER_TABLE_NAME'],
        Key={
            'PK': {'S': connectionId},
            'SK': {'S': connectionId},
        },
    )

    dynamodb.delete_item(
        TableName=os.environ['POKER_TABLE_NAME'],
        Key={
            'PK': {'S': connectionId},
            'SK': {'S': connectionId},
        },
    )

    return {}