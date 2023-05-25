import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class MyLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layerExampleLambda = new NodejsFunction(this, "LayerExampleLambda", {
      entry: "./functions/parse-function/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        REGION: "us-east-1",
      },
      timeout: Duration.seconds(15),
      memorySize: 128,
      bundling: {
        sourceMap: true,
        externalModules: ["aws-sdk", "@billbox/base"],
      },
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "BaseLayerVersionName",
          "arn:aws:lambda:us-east-1:833319748114:layer:BaseLayerVersionName:3"
        ),
      ],
    });
  }
}
