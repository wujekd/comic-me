import { ddbClient } from "./ddbClient.mjs";
import { GetItemCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";





const run = async (username, newSub)=>{
    let status = 200
    let headers = ''
    let body;

    const getParams = {
        TableName: "users",
        Key: {
            username: { S : username }
        },
        ProjectionExpression: "subbed"
    }
    try {
        const getResponse = await ddbClient.send(new GetItemCommand(getParams))
        const subbedList = unmarshall(getResponse.Item).subbed

        if (!subbedList.includes(newSub)) {
            subbedList.push(newSub);
        } else {
            console.log("User is already subscribed.");
            return;
        }
        console.log(subbedList)
        const updateParams = {
            TableName: "users",
            Key: {
                username: { S: username }
            },
            UpdateExpression: "SET subbed = :newval",
            ExpressionAttributeValues: {
                ":newval" : marshall({ subbed: subbedList}).subbed
            },
            ReturnValues: "ALL_NEW"
        };

        const data = await ddbClient.send(new UpdateItemCommand(updateParams))
        console.log(data)


    } catch (e) {
        console.log(e)
    }
};



run("Brian", "Harold");

// const xx = ['asd', 'asdf', 'gdf', 'reg']

// console.log(marshall({ subbed: xx}).subbed)