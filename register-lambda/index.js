const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require('bcryptjs');

const client = new DynamoDBClient();

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    // Hash the password before saving it to DynamoDB
    const hashedPassword = bcrypt.hashSync(password, 10);

    const params = {
        TableName: 'Users',
        Item: {
            username: username,
            password: hashedPassword
        }
    };

    try {
        const command = new PutCommand(params);
        await client.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'User registered successfully' })
        };
    } catch (error) {
        console.error("Error registering user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Error registering user' })
        };
    }
};
