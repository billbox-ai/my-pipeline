import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { PipelineAppStage } from "./pipeline-app-stage";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rolePolicy: PolicyStatement[] = [
      new PolicyStatement({
        actions: [
          "codeartifact:GetAuthorizationToken",
          "codeartifact:GetRepositoryEndpoint",
          "codeartifact:ReadFromRepository",
        ],
        resources: ["*"],
      }),
      new PolicyStatement({
        actions: ["sts:GetServiceBearerToken"],
        resources: ["*"],
        conditions: {
          StringEquals: { "sts:AWSServiceName": "codeartifact.amazonaws.com" },
        },
      }),
    ];

    const pipeline = new CodePipeline(this, "InboundEmailPipeline", {
      pipelineName: "InboundEmailPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("billbox-ai/my-pipeline", "main"),
        commands: [
          "npm run co:login",
          "npm ci",
          "npm run build",
          "npx cdk synth",
        ],
      }),

      codeBuildDefaults: {
        rolePolicy: rolePolicy,
      },
    });

    const devStage = pipeline.addStage(
      new PipelineAppStage(this, "dev", {
        env: { account: "833319748114", region: "us-east-1" },
      })
    );

    //devStage.addPost(new ManualApprovalStep("approval"));

    //const prodStage = pipeline.addStage(
    //  new MyPipelineAppStage(this, "prod", {
    //    env: { account: "833319748114", region: "us-east-1" },
    //  })
    //);
  }
}
