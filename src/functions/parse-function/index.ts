import { S3 } from "aws-sdk";
import { metrics, LambdaHandler, mailparser } from "billbox-base";

//TODO update to types folder outside of src
import { ParseEvent } from "./types";

class ParseLambdaHandler extends LambdaHandler {
  constructor() {
    const eventSchema = require("./schemas/schema.event.json");
    const responseSchema = require("./schemas/schema.response.json");
    super("email", eventSchema, responseSchema);
  }

  protected async handleEvent(event: ParseEvent): Promise<any> {
    this.logger.info("Event Received", JSON.stringify(event));

    // TODO: Add your event handling logic here
    const params = {
      Bucket: event.DocumentLocation.S3Object.Bucket,
      Key: event.DocumentLocation.S3Object.Name,
    };

    //TODO put catch and handle errors like no message returned, access not allowed to S3 bucket, etc
    const s3 = new S3();
    const data = await s3.getObject(params).promise();
    const message = data.Body?.toString("utf-8") || "";

    const parsedMessage: mailparser.ParsedMail = await mailparser.simpleParser(
      message
    );

    const response = {
      result: "success",
      message: parsedMessage,
    };

    this.metrics.addMetric("successfulParsing", metrics.MetricUnits.Count, 1);
    this.logger.info("Response = " + JSON.stringify(response));
    return response;
  }
}

const parseHandler = new ParseLambdaHandler();
export const handler = parseHandler.getHandler();
