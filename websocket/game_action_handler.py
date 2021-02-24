import json
import boto3
import os
import asyncio

dynamodb = boto3.client('dynamodb')

async def setUsername(uid, body):
    bit = await dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': body['displayName']}})

    return {
        'sendTo': [ uid ],
        'response': {
            'method': 'setUsername',
            'success': bit,
        }
    }

async def main(event, context):
    print(event)

    uid = event['requestContext']['connectionId']
    body = json.loads(event['body'])

    if body['action'] == 'setUsername':
        result = await setUsername(uid, body)

    if event["requestContext"]["domainName"] == 'localhost':
        endpoint = 'http://localhost:3001/'
    else:
        endpoint = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"]

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    response = result['response']
    connectionIds = result['sendTo']

    # Emit response to all connected devices
    for connectionId in connectionIds:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response),
            ConnectionId=connectionId['connectionId']['S']
        )

    return {}

def handle(event, context):
    # asyncio.run(main(event, context))
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(main(event, context))



# paginator = dynamodb.get_paginator('scan')
# connectionIds = []
# for page in paginator.paginate(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME']):
#     connectionIds.extend(page['Items'])