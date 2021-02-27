import json
import boto3
import os
import asyncio

dynamodb = boto3.client('dynamodb')

async def setUsername(connectionId, body):
    status = dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': body['username']}})

    return {
        'sendTo': [ connectionId ],
        'response': {
            'method': 'setUsername',
            'success': status,
        }
    }

async def main(event, context):
    print(event)

    # Player who sent request
    connectionId = event['requestContext']['connectionId']

    # Request body containing ACTION
    body = json.loads(event['body'])

    # Routes
    if body['method'] == 'setUsername':
        result = await setUsername(connectionId, body)
    else if body['method'] == 'createGame':
        result = await createGame(connectionId, body)
    else:
        result = {
            'sendTo': [ connectionId ],
            'response': {
                'method': 'setUsername',
                'success': bit,
            }
        }

    # Dev or Live environment
    if event["requestContext"]["domainName"] == 'localhost':
        endpoint = 'http://localhost:3001/'
    else:
        endpoint = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"]

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    # Emit response back to user(s)
    response = result['response']
    connectionIds = result['sendTo']

    for connectionId in connectionIds:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response),
            ConnectionId=connectionId
        )

    return {}

def handle(event, context):
    asyncio.run(main(event, context))



# paginator = dynamodb.get_paginator('scan')
# connectionIds = []
# for page in paginator.paginate(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME']):
#     connectionIds.extend(page['Items'])