import { CreateEmailAddressEvent, EmailAddressesCreated } from "./types/";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB();

export const handler = async (
  event: CreateEmailAddressEvent
): Promise<EmailAddressesCreated> => {
  //const { emailAddress } = JSON.parse(event. || "");

  const params: DynamoDB.PutItemInput = {
    TableName: process.env.EMAIL_TABLE_NAME!,
    Item: {
      emailAddress: { S: "test@email.com" },
    },
  };

  try {
    await dynamoDB.putItem(params).promise();

    return {
      emailAddresses: ["test@email.com"],
    };
  } catch (error) {
    console.error("Error creating email:", error);

    //TODO fix schema validation
    return {
      emailAddresses: ["ERROR"],
    };
  }
};
