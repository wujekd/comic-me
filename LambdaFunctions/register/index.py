import boto3
import json
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    print(event)

    try:
        # Parse the request body
        body = json.loads(event['body'])
        username = body.get("username", "Unknown")
        password = body.get("password", "Unknown")

        # unique ID ??
        # user_id = str(uuid.uuid4())
        table.put_item(Item={
            "username": username,
            "password" : password
        })

# success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                "message": "User saved successfully.",
                "user_id": username,
                "status": "success"
            })
        }

# ERROR RESPONSE
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                "message": "Error saving user.",
                "error": str(e),
                "status": "error"
            })
        }