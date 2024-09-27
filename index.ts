import * as aws from "@pulumi/aws";

// Create an S3 bucket for static website hosting
const siteBucket = new aws.s3.Bucket("static-site", {
    website: {
        indexDocument: "index.html",  // Define index.html as the default document
    },
});

// Configure the bucket policy to allow public read access to all objects
const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: siteBucket.bucket,
    policy: siteBucket.bucket.apply(bucketName => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
        }],
    })),
});

// Export the bucket name and the URL of the website
export const bucketName = siteBucket.bucket;
export const websiteUrl = siteBucket.websiteEndpoint;
