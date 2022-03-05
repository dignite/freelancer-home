const { S3Client } = require("@aws-sdk/client-s3");
const S3SyncClient = require("s3-sync-client");

const s3Client = new S3Client({ region: "us-east-1" });
const { sync } = new S3SyncClient({ client: s3Client });

const run = async () => {
  await sync(
    `s3://${process.env.SERVERLESS_STATE_S3_BUCKET}/prod/.serverless`,
    "./.serverless/",
    { del: true, relocations: [["prod/.serverless", ""]] }
  );
};

run();
