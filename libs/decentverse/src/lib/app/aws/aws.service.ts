import * as aws from "aws-sdk";
import * as fs from "fs";

import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import * as dto from "./aws.dto";

export interface ObjectStorageOptionss {
  region: string;
  accessKey: string;
  secretAccessKey: string;
  distributionId: string;
}

@Injectable()
export class AwsService {
  s3: aws.S3;
  distributionId: string;
  cloudFront: aws.CloudFront;
  constructor(
    @Inject("OBJECT_STORAGE_OPTIONS") private options: ObjectStorageOptionss
  ) {
    this.s3 = new aws.S3({ apiVersion: "2006-03-01" });
    aws.config.update({
      region: this.options.region,
      accessKeyId: this.options.accessKey,
      secretAccessKey: this.options.secretAccessKey,
    });
    this.cloudFront = new aws.CloudFront();
    this.distributionId = this.options.distributionId;
  }
  async getObject({ bucket, path, filename }: dto.GetObjectRequest) {
    return await this.s3
      .getObject({ Bucket: bucket, Key: `${path}/${filename}` })
      .promise();
  }
  async getJsonObject({ bucket, path, filename }: dto.GetObjectRequest) {
    const data = await this.s3
      .getObject({ Bucket: bucket, Key: `${path}/${filename}` })
      .promise();
    return JSON.parse(data.Body.toString("utf-8"));
  }
  async getObjectList(bucket: string) {
    return await this.s3.listObjects({ Bucket: bucket }).promise();
  }
  async getFileList(bucket: string, prefix: string | undefined = undefined) {
    const filenames: string[] = [];
    return await this.getAllKeys({ Bucket: bucket, Prefix: prefix }, filenames);
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
    filename,
    rename,
    localPath,
    meta,
    host,
  }: dto.AwsUploadRequest) {
    const key = `${path}/${rename ?? filename}`;
    // const metadata = { ...(meta ?? {}) };
    await this.s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Metadata: meta,
        ACL: "public-read",
        Body: fs.createReadStream(`${localPath}/${filename}`),
        ContentType: this.getContentType(filename),
      })
      .promise();
    return host
      ? this.getServiceUrl(host, key)
      : this.getObjectUrl(bucket, key);
  }

  async saveFile({
    bucket,
    path,
    filename,
    localPath,
    rename,
  }: dto.DownloadRequest): Promise<dto.LocalFilePath> {
    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });
    const stream = this.s3
      .getObject({
        Bucket: bucket,
        Key: `${path}/${filename}`,
      })
      .createReadStream();
    stream.pipe(fs.createWriteStream(`${localPath}/${filename}`));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        rename &&
          fs.renameSync(`${localPath}/${filename}`, `${localPath}/${rename}`);
        setTimeout(
          () => resolve({ filename: rename ?? filename, localPath }),
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
    filename,
    host,
  }: dto.CopyRequest) {
    const key = `${pastePath}/${filename}`;
    await this.s3
      .copyObject({
        CopySource: `${bucket}/${copyPath}/${filename}`,
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
    filename,
  }: {
    bucket: string;
    path: string;
    filename: string;
  }) {
    await this.s3
      .putObjectAcl({
        ACL: "public-read",
        Bucket: bucket,
        Key: `${path}/${filename}`,
      })
      .promise();
    return true;
  }
  async makePrivate({
    bucket,
    path,
    filename,
  }: {
    bucket: string;
    path: string;
    filename: string;
  }) {
    await this.s3
      .putObjectAcl({
        ACL: "private",
        Bucket: bucket,
        Key: `${path}/${filename}`,
      })
      .promise();
    return true;
  }
  getContentType(filename: string) {
    return filename.includes(".png")
      ? "image/jpeg"
      : filename.includes(".json")
      ? "application/json"
      : undefined;
  }
}
