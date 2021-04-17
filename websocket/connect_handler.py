import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    connectionId = event['requestContext']['connectionId']

    dynamodb.put_item(
        TableName=os.environ['POKER_TABLE_NAME'],
        Item={
            'PK': {'S': connectionId},
            'SK': {'S': connectionId}
        },
    )

    return {}