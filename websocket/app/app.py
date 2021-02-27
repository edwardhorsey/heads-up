import json
import boto3
import os
import asyncio

dynamodb = boto3.client('dynamodb')

# Game functions
async def setUsername(endpoint, connectionId, body):
    status = dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': body['username']}})

    response = {
        'method': 'setUsername',
        'success': status,
    }

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )