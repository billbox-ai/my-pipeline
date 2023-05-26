#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MyPipelineStack } from "../lib/my-pipeline-stack";

const app = new cdk.App();
new MyPipelineStack(app, "MyPipelineStack", {
  env: {
    account: "833319748114",
    region: "us-east-1",
  },
});

app.synth();