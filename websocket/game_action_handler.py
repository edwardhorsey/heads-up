import json
import boto3
import os
import asyncio

from app.app import setUsername

dynamodb = boto3.client('dynamodb')

# Dev or Live environment
def get_endpoint(event):
    if event["requestContext"]["domainName"] == 'localhost':
        return 'http://localhost:3001/'
    else:
        return "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"]


async def main(event, context):
    print(event)

    # Player who sent request
    connectionId = event['requestContext']['connectionId']
    endpoint = get_endpoint(event)

    # Request body containing ACTION
    body = json.loads(event['body'])

    # Routes
    if body['method'] == 'setUsername':
        await setUsername(endpoint, connectionId, body)
    elif body['method'] == 'createGame':
        await createGame(endpoint, connectionId, body)
    else:
        response = {
            'method': body['method'],
            'message': 'Method not recognised',
        }

        # Emit response back to user
        apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response),
            ConnectionId=connectionId
        )

    return {}

def handle(event, context):
    asyncio.run(main(event, context))


# for connectionId in connectionIds:
#     apigatewaymanagementapi.post_to_connection(
#         Data=json.dumps(response),
#         ConnectionId=connectionId
#     )

# paginator = dynamodb.get_paginator('scan')
# connectionIds = []
# for page in paginator.paginate(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME']):
#     connectionIds.extend(page['Items'])