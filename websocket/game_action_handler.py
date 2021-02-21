import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    
    uid = event['requestContext']['connectionId']
    action = json.loads(event['body'])['action']
    
    paginator = dynamodb.get_paginator('scan')
    connectionIds = []

    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', 
    endpoint_url = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"])
    for page in paginator.paginate(TableName=os.environ['SOCKET_CONNECTIONS_TABLE_NAME']):
        connectionIds.extend(page['Items'])

    response = {
        'action': 'gameAction',
        'test': 'HI ED'
    }

    # Emit response to all connected devices
    for connectionId in connectionIds:
        if connectionId['name']['S']:
            apigatewaymanagementapi.post_to_connection(
                Data=json.dumps(response),
                ConnectionId=connectionId['connectionId']['S']
            )

    return {}