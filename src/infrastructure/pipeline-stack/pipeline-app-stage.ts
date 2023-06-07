import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { InboundEmailStack } from "../inbound-email-stack/inbound-email-stack";

export class PipelineAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const inboundEmailStack = new InboundEmailStack(
      this,
      "InboundEmailStack",
      undefined,
      id
    );
  }
}
