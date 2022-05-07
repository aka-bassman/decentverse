import * as aws from "aws-sdk";
import * as fs from "fs";

import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import * as dto from "./aws.dto";

@Injectable()
export class AwsService {
  s3: aws.S3;
  distributionId: string;
  cloudFront: aws.CloudFront;
  constructor(configService: ConfigService) {
    this.s3 = new aws.S3({ apiVersion: "2006-03-01" });
    aws.config.update({
      region: "ap-northeast-2",
      accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
    });
    this.cloudFront = new aws.CloudFront();
    this.distributionId = configService.get("AWS_CLOUDFRONT_DIST_ID");
  }
  async getObject({ bucket, path, fileName }: dto.GetObjectRequest) {
    return await this.s3
      .getObject({ Bucket: bucket, Key: `${path}/${fileName}` })
      .promise();
  }
  async getJsonObject({ bucket, path, fileName }: dto.GetObjectRequest) {
    const data = await this.s3
      .getObject({ Bucket: bucket, Key: `${path}/${fileName}` })
      .promise();
    return JSON.parse(data.Body.toString("utf-8"));
  }
  async getObjectList(bucket: string) {
    return await this.s3.listObjects({ Bucket: bucket }).promise();
  }
  async getFileList(bucket: string, prefix: string | undefined = undefined) {
    const fileNames: string[] = [];
    return await this.getAllKeys({ Bucket: bucket, Prefix: prefix }, fileNames);
  }
  async getAllKeys(
    params: aws.S3.ListObjectsV2Request,
    allKeys: string[] = []
  ) {
    const response = await this.s3.listObjectsV2(params).promise();
    response.Contents.forEach((obj) => allKeys.push(obj.Key));
    if (response.NextContinuationToken) {
      params.ContinuationToken = response.NextContinuationToken;
      await this.getAllKeys(params, allKeys); // RECURSIVE CALL
    }
    return allKeys;
  }
  getObjectUrl(bucket: string, object: string) {
    return `https://${bucket}.s3.${aws.config.region}.amazonaws.com/${object}`;
  }
  getServiceUrl(host: string, object: string) {
    return `https://${host}/${object}`;
  }
  async uploadFile({
    bucket,
    path,
    fileName,
    rename,
    localPath,
    meta,
    host,
  }: dto.AwsUploadRequest) {
    const key = `${path}/${rename ?? fileName}`;
    // const metadata = { ...(meta ?? {}) };
    await this.s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Metadata: meta,
        ACL: "public-read",
        Body: fs.createReadStream(`${localPath}/${fileName}`),
        ContentType: this.getContentType(fileName),
      })
      .promise();
    return host
      ? this.getServiceUrl(host, key)
      : this.getObjectUrl(bucket, key);
  }

  async saveFile({
    bucket,
    path,
    fileName,
    localPath,
    rename,
  }: dto.DownloadRequest): Promise<dto.LocalFilePath> {
    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });
    const stream = this.s3
      .getObject({
        Bucket: bucket,
        Key: `${path}/${fileName}`,
      })
      .createReadStream();
    stream.pipe(fs.createWriteStream(`${localPath}/${fileName}`));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        rename &&
          fs.renameSync(`${localPath}/${fileName}`, `${localPath}/${rename}`);
        setTimeout(
          () => resolve({ fileName: rename ?? fileName, localPath }),
          100
        );
      });
      stream.on("error", (error) => {
        reject("File Download Error");
      });
    });
  }
  async copyObject({
    bucket,
    copyPath,
    pastePath,
    fileName,
    host,
  }: dto.CopyRequest) {
    const key = `${pastePath}/${fileName}`;
    await this.s3
      .copyObject({
        CopySource: `${bucket}/${copyPath}/${fileName}`,
        Bucket: bucket,
        Key: key,
        ACL: "public-read",
      })
      .promise();
    return host
      ? this.getServiceUrl(host, key)
      : this.getObjectUrl(bucket, key);
  }
  async invalidateObjects(keys: string[]) {
    this.cloudFront.createInvalidation({
      DistributionId: "",
      InvalidationBatch: {
        Paths: {
          Quantity: keys.length,
          Items: keys,
        },
        CallerReference: new Date().getTime().toString(),
      },
    });
  }
  async makePublic({
    bucket,
    path,
    fileName,
  }: {
    bucket: string;
    path: string;
    fileName: string;
  }) {
    await this.s3
      .putObjectAcl({
        ACL: "public-read",
        Bucket: bucket,
        Key: `${path}/${fileName}`,
      })
      .promise();
    return true;
  }
  async makePrivate({
    bucket,
    path,
    fileName,
  }: {
    bucket: string;
    path: string;
    fileName: string;
  }) {
    await this.s3
      .putObjectAcl({
        ACL: "private",
        Bucket: bucket,
        Key: `${path}/${fileName}`,
      })
      .promise();
    return true;
  }
  getContentType(fileName: string) {
    return fileName.includes(".png")
      ? "image/jpeg"
      : fileName.includes(".json")
      ? "application/json"
      : undefined;
  }
}
