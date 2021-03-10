import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

# Dev or Live environment
def get_endpoint(event):
    if event["requestContext"]["domainName"] == 'localhost': ### this can be a dev / prod env variable
        return 'http://localhost:3001/'
    else:
        return "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"]


def handle(event, context):
    connectionId = event['requestContext']['connectionId']

    # Insert the Id and default name of the connected user to the database
    dynamodb.put_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Item={'connectionId': {'S': connectionId}, 'name': {'S': ''}})

    response = {
        'method': 'connected',
        'uid': connectionId
    }

    # Emit response back to user
    apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url = get_endpoint(event))
    apigatewaymanagementapi.post_to_connection(
        Data=json.dumps(response),
        ConnectionId=connectionId
    )

    return {}