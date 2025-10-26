export type FileType = 'file' | 'directory';

export type FileEntry = {
  path: string,
  type: FileType,
}

const TEXTS = [
  'txt', 'md'
];

export function isText(ext: string): boolean {
  return TEXTS.indexOf(ext) !== -1;
}

const CODES = [
  'html', 'css', 'js', 'json', 'bat', 'xml', 'py', 'java'
];

export function isCode(ext: string): boolean {
  return CODES.indexOf(ext) !== -1;
}

const IMGS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp'
];

export function isImage(ext: string): boolean {
  return IMGS.indexOf(ext) !== -1;
}

export function getExt(fpath: string): string {
  return fpath.substring(fpath.lastIndexOf('.') + 1);
}