const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const bucket = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

async function getObjectSignedURL(key) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command);
    // const url = await getSignedUrl(s3Client, command, {expiresIn: 3600,});
    return url;
}

async function getObjectPublicURL(path) {
    const url = `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${path}`;
    return url;
}

async function putObject(fileName, contentType, body) {
    const key = `uploads/product-images/${fileName}`
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType
    });
    await s3Client.send(command);
    console.log(`Image uploaded to S3: ${key}`)
    // const url = await getSignedUrl(s3Client, command);
    // return url;
    return key;
}

async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
    });
    await s3Client.send(command);
}

async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Key: '/'
    });
    const result = await s3Client.send(command);
    console.log(result);
    // return result;
}

module.exports = { getObjectSignedURL, getObjectPublicURL, putObject, deleteObject, listObjects };