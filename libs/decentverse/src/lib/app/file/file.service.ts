import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { promisify } from "util";
import imageSize from "image-size";
const sizeOf = promisify(imageSize);
import * as fs from "fs";
import * as File from "./file.model";
import * as gql from "../../app/gql";
import * as srv from "../srv";
import * as db from "../db";
import * as dto from "./file.dto";
import * as sharp from "sharp";
@Injectable()
export class FileService {
  bucket = "dev.akamir";
  root = "decentverse";
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
  async addFileFromLocal(localFile: gql.LocalFile, purpose: gql.FilePurpose, group: string) {
    const url = await this.awsService.uploadFile({
      path: `${this.root}/${purpose}/${group}`,
      filename: localFile.filename,
      localPath: localFile.localPath,
    });
    const { width, height } = localFile.mimetype.includes("image")
      ? await sizeOf(`${localFile.localPath}/${localFile.filename}`)
      : { width: 0, height: 0 };
    return await this.File.create({ ...localFile, imageSize: [width, height], url });
  }
  async addFile(fileStream: gql.FileStream, purpose: gql.FilePurpose, group: string) {
    const localFile = await this.saveLocalStorage(fileStream);
    return await this.addFileFromLocal(localFile, purpose, group);
  }
  async addFiles(fileStreams: gql.FileStream[], purpose: gql.FilePurpose, group: string) {
    const files = await Promise.all(
      fileStreams.map(async (fileStream) => await this.addFile(fileStream, purpose, group))
    );
    return files;
  }
  async addMapFile(fileStream: gql.FileStream, purpose: gql.FilePurpose, group: string) {
    const localFile = await this.saveLocalStorage(fileStream);
    const image = await sharp(`${localFile.localPath}/${localFile.filename}`);
    const { width, height } = await image.metadata();
    const tileSize = 2000;
    const [topOffset, rightOffset] = [tileSize - (height % tileSize), tileSize - (width % tileSize)];
    const [totalWidth, totalHeight] = [width + rightOffset, height + topOffset];

    // 여백 추가
    const extendFileName = await this.createExtendedImage(localFile, topOffset, rightOffset);
    // slice 위치 지정
    const positions = this.getMapPositions(totalWidth, totalHeight, tileSize);
    // slice, upload
    const files = await Promise.all(
      positions.map(async (position) => {
        const slicedFileName = await this.createSlicedImage(localFile, extendFileName, tileSize, position);
        const newLocalFile = { ...localFile, filename: slicedFileName };
        const newGroup = `${group}/${position.widthIndex}-${position.heightIndex}`;
        return await this.addFileFromLocal(newLocalFile, purpose, newGroup);
      })
    );
    return files;
  }
  async saveLocalStorage(file: gql.FileStream): Promise<gql.LocalFile> {
    const { filename, mimetype, encoding, createReadStream } = await file;
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
          localPath: localDir,
        });
      });
      stream.on("error", () => reject());
    });
  }
  convertFileName(filename: string) {
    return `dcnt-${new Date().getTime()}-${filename}`;
  }
  async createExtendedImage(localFile: gql.LocalFile, topOffset: number, rightOffset: number) {
    const extendedFileName = `extended_${localFile.filename}`;
    await sharp(`${localFile.localPath}/${localFile.filename}`)
      .extend({
        top: topOffset,
        right: rightOffset,
        background: "white",
      })
      .toFile(`${localFile.localPath}/${extendedFileName}`);
    return extendedFileName;
  }
  async createSlicedImage(
    localFile: gql.LocalFile,
    extendFileName: string,
    tileSize: number,
    position: dto.SlicePosition
  ) {
    const slicedFileName = `${localFile.filename}_${position.widthIndex}_${position.heightIndex}.jpg`;
    await sharp(`${localFile.localPath}/${extendFileName}`)
      .extract({ top: position.top, left: position.left, width: tileSize, height: tileSize })
      .toFile(`${localFile.localPath}/${slicedFileName}`);
    return slicedFileName;
  }
  getMapPositions(totalWidth, totalHeight, tileSize): dto.SlicePosition[] {
    const positions = [];
    for (let j = 0; j < totalHeight; j += tileSize) {
      for (let i = 0; i < totalWidth; i += tileSize) {
        positions.push({
          left: i,
          top: totalHeight - (j + tileSize),
          widthIndex: i / tileSize,
          heightIndex: j / tileSize,
        });
      }
    }
    return positions;
  }
}
