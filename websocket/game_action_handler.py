import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    
    print(event)

    uid = event['requestContext']['connectionId']
    action = json.loads(event['body'])['action']
    
    paginator = dynamodb.get_paginator('scan')
    connectionIds = []

    if event["requestContext"]["domainName"] == 'localhost':
        endpoint = 'http://localhost:3001/'
    else:
        endpoint = '"https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"]'

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)

    for page in paginator.paginate(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME']):
        connectionIds.extend(page['Items'])

    response = {
        'action': action,
        'body': json.loads(event['body']),
        'test': 'HI ED',
    }

    # Emit response to all connected devices
    for connectionId in connectionIds:
        apigatewaymanagementapi.post_to_connection(
            Data=json.dumps(response),
            ConnectionId=connectionId['connectionId']['S']
        )

    return {}