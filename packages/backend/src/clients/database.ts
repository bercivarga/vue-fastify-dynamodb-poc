import { DynamoDB } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const region = "us-west-2";
const dynamoDb = new DynamoDB({
  region,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecret",
  },
});

export default dynamoDb;
