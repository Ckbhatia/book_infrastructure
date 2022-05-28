import { Stack, StackProps, aws_s3 as s3, aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'BooksApp', {
      bucketName: 'books-app-bucket',
      websiteIndexDocument: 'index.html',
      blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: false })
    });

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'OAI');

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudFrontOAI,
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    })

    bucket.grantRead(cloudFrontOAI.grantPrincipal);
  }
}