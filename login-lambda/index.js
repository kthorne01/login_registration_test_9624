const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require('bcryptjs');

const client = new DynamoDBClient();

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    const params = {
        TableName: 'Users',
        Key: { username: { S: username } }
    };

    try {
        const command = new GetCommand(params);
        const result = await client.send(command);

        if (result.Item && bcrypt.compareSync(password, result.Item.password.S)) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Login successful' })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid credentials' })
            };
        }
    } catch (error) {
        console.error("Error during login:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Error logging in' })
        };
    }
};
