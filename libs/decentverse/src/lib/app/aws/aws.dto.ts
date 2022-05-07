export interface GetObjectRequest {
  bucket: string;
  path: string;
  fileName: string;
}
export interface DownloadRequest extends GetObjectRequest {
  localPath: string;
  rename?: string;
}
export interface LocalFilePath {
  localPath: string;
  fileName: string;
}
export interface LocalTokenPath {
  metaPath: LocalFilePath;
  assetPath: LocalFilePath;
}
export interface AwsUploadRequest {
  bucket: string;
  path: string;
  fileName: string;
  localPath: string;
  meta?: Record<string, any>;
  rename?: string;
  host?: string;
}
export interface CopyRequest {
  bucket: string;
  copyPath: string;
  pastePath: string;
  fileName: string;
  host?: string;
}
export interface Bucket {
  name: string;
  host: string;
  root: string;
}
