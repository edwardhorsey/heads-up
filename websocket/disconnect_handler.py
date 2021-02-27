import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def handle(event, context):
    uid = event['requestContext']['connectionId']
    user_db_item = dynamodb.get_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Key={'connectionId': {'S': uid}})

    # Delete connectionId from the database
    dynamodb.delete_item(TableName=os.environ['POKER_CONNECTIONS_TABLE_NAME'], Key={'connectionId': {'S': uid}})

    return {}