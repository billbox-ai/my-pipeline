import { DeleteEmailAddressesEvent, EmailAddressesDeleted } from "./types/";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB();

export const handler = async (
  event: DeleteEmailAddressesEvent
): Promise<EmailAddressesDeleted> => {
  //const { emailAddress } = JSON.parse(event. || "");

  const params: AWS.DynamoDB.DeleteItemInput = {
    TableName: process.env.EMAIL_TABLE_NAME!,
    Key: {
      emailAddress: { S: "test@test.com" },
    },
  };

  try {
    await dynamoDB.deleteItem(params).promise();

    return {
      emailAddresses: ["test@email.com"],
    };
  } catch (error) {
    console.error("Error deleting email:", error);

    //TODO fix schema validation
    return {
      emailAddresses: ["ERROR"],
    };
  }
};
