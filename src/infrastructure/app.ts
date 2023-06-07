#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "./pipeline-stack/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, "InboundEmailPipelineStack", {
  env: {
    account: "833319748114",
    region: "us-east-1",
  },
});

app.synth();
