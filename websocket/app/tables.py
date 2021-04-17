import os
import boto3

dynamodb = boto3.resource('dynamodb')
poker_table = dynamodb.Table(os.environ['POKER_TABLE_NAME'])