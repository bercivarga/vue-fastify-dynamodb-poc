// src/utils/ensureTableExists.ts
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const client = new DynamoDBClient({
  region: "us-west-2",
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
});

const TABLE_NAME = "Textile";

const params: CreateTableCommandInput = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }, // S for string
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

/**
 * Ensures that the DynamoDB table exists. If the table does not exist,
 * it creates the table with the specified schema.
 */
export const ensureTableExists = async () => {
  try {
    // Check if the table exists
    const data = await client.send(
      new DescribeTableCommand({ TableName: TABLE_NAME })
    );
    console.log(
      `Table ${TABLE_NAME} already exists. Status: ${data.Table?.TableStatus}`
    );
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log(`Table ${TABLE_NAME} does not exist. Creating...`);
      try {
        // Create the table if it doesn't exist
        await client.send(new CreateTableCommand(params));
        console.log(`Table ${TABLE_NAME} created successfully.`);
      } catch (createError) {
        console.error(`Error creating table ${TABLE_NAME}:`, createError);
      }
    } else {
      console.error(`Unable to check or create table. Error:`, error);
    }
  }
};
