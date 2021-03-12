import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    connectionId = event['requestContext']['connectionId']

    # Insert the Id and default name of the connected user to the database
    dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': ''}})

    response = {
        'method': 'connected',
        'uid': connectionId
    }

    endpoint = os.environ['API_ENDPOINT'] if os.environ['API_ENDPOINT'] else ("https://"
        + event["requestContext"]["domainName"]
        + "/"
        + event["requestContext"]["stage"])

    # Emit response back to user
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = endpoint)
    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )

    return {}