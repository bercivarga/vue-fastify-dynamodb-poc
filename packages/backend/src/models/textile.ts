import dynamoDb from "../clients/database";

export interface ITextile {
  id: string;
  name: string;
  description: string;
}

import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Textile";

// Get all textiles
export const getAllTextiles = async (): Promise<ITextile[]> => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.send(new ScanCommand(params));
  return result.Items as ITextile[];
};

// Create a new textile
export const createTextile = async (textile: ITextile): Promise<ITextile> => {
  const params = {
    TableName: TABLE_NAME,
    Item: textile,
  };

  await dynamoDb.send(new PutCommand(params));
  return textile;
};

// Get a textile by id
export const getTextileById = async (id: string): Promise<ITextile | null> => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  return result.Item as ITextile | null;
};

// Update a textile by id
export const updateTextile = async (
  id: string,
  updateData: Partial<ITextile>
): Promise<void> => {
  const updateExpression =
    "set " +
    Object.keys(updateData)
      .map((key, idx) => `#${key} = :value${idx}`)
      .join(", ");
  const expressionAttributeNames = Object.keys(updateData).reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {}
  );
  const expressionAttributeValues = Object.keys(updateData).reduce(
    (acc, key, idx) => ({
      ...acc,
      [`:value${idx}`]: updateData[key as keyof ITextile],
    }),
    {}
  );

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  await dynamoDb.send(new UpdateCommand(params));
};

// Delete a textile by id
export const deleteTextile = async (id: string): Promise<void> => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  await dynamoDb.send(new DeleteCommand(params));
};
