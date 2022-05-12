import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from "fs";
import * as File from "./file.model";
import * as gql from "../../app/gql";
import * as srv from "../srv";
import * as db from "../db";
@Injectable()
export class FileService {
  bucket = "dev.akamir";
  root = "decentverse";
  host = "asset.akamir.com";
  private readonly logger = new Logger(FileService.name);
  private loader: db.DataLoader<db.ID, db.Asset.Doc>;
  constructor(
    @InjectModel(File.File.name) private readonly File: File.Mdl,
    private readonly awsService: srv.AwsService
  ) {
    this.loader = db.createLoader(this.File);
  }
  async load(assetId?: db.ID) {
    return assetId && (await this.loader.load(assetId));
  }
  async loadMany(assetIds: db.ID[]) {
    return await this.loader.loadMany(assetIds);
  }
  async addFileFromLocal(localFile: gql.LocalFile) {
    const url = await this.awsService.uploadFile({
      bucket: this.bucket,
      path: this.root,
      filename: localFile.filename,
      localPath: localFile.localPath,
      // host: this.host,
    });
    return await this.File.create({ ...localFile, url });
  }
  async addFile(fileStream: gql.FileStream) {
    const localFile = await this.saveLocalStorage(fileStream);
    return await this.addFileFromLocal(localFile);
  }
  async addFiles(fileStreams: gql.FileStream[]) {
    const files = await Promise.all(fileStreams.map(async (fileStream) => await this.addFile(fileStream)));
    return files;
  }
  async saveLocalStorage(file: gql.FileStream): Promise<gql.LocalFile> {
    const { filename, mimetype, encoding, createReadStream } = file;
    const localDir = `./data`;
    fs.mkdirSync(localDir, { recursive: true });
    const localPath = `${localDir}/${filename}`;
    const rename = this.convertFileName(filename);
    const renamePath = `${localDir}/${rename}`;
    const stream = createReadStream();
    stream.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        fs.renameSync(localPath, renamePath);
        resolve({
          filename: rename,
          mimetype,
          encoding,
          localPath: renamePath,
        });
      });
      stream.on("error", () => reject());
    });
  }
  convertFileName(filename: string) {
    return `dcnt-${new Date().getTime()}-${filename}`;
  }
}
