import { Duration, Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class MyLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: StackProps,
    stageName?: string
  ) {
    super(scope, id, props);

    // get latest version of base layer
    const latestBaseLayerArn = StringParameter.valueForStringParameter(
      this,
      "/BaseLayerStack/BaseLayerArn-" + stageName
    );

    // TODO extract this to billbox lambda construct
    const parseEmailFunction = new NodejsFunction(
      this,
      "ParseEmailFunction-" + stageName,
      {
        entry: "./src/functions/parse-function/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_16_X,
        environment: {
          REGION: "us-east-1",
        },
        timeout: Duration.seconds(15),
        memorySize: 128,
        bundling: {
          sourceMap: true,
          externalModules: ["aws-sdk", "billbox-base"],
        },
        layers: [
          LayerVersion.fromLayerVersionArn(
            this,
            "BaseLayerVersionName",
            latestBaseLayerArn
          ),
        ],
      }
    );

    // TODO extract stateful resources to another stack - look at common constructs
    const emailTable = new dynamodb.Table(this, "EmailAddressTable", {
      partitionKey: {
        name: "emailAddress",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const createEmailAddressesFunction = new NodejsFunction(
      this,
      "CreateEmailAddressesFunction-" + stageName,
      {
        entry: "./src/functions/create-email-addresses-function/index.ts",
        handler: "handler",
        runtime: Runtime.NODEJS_16_X,
        environment: {
          REGION: "us-east-1",
        },
        timeout: Duration.seconds(15),
        memorySize: 128,
        bundling: {
          sourceMap: true,
          externalModules: ["aws-sdk", "billbox-base"],
        },
        layers: [
          LayerVersion.fromLayerVersionArn(
            this,
            "BaseLayerVersionName",
            latestBaseLayerArn
          ),
        ],
      }
    );

    emailTable.grantReadWriteData(createEmailAddressesFunction);
  }
}
