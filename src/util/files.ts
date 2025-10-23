import fs from 'fs';
import path from 'path';

export type FileType = 'file' | 'directory';

type FileEntry = {
  path: string,
  type: FileType,
}

const TEXTS = [
  'txt', 'md', 'html', 'css', 'js', 'json', 'bat', 'xml', 'py', 'java'
];

export function isText(ext: string): boolean {
  return TEXTS.indexOf(ext) !== -1;
}

const IMGS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp'
];

export function isImage(ext: string): boolean {
  return IMGS.indexOf(ext) !== -1;
}

export function getExt(fpath: string): string {
  return path.extname(fpath).substring(1);
}

const BASE_PATH = './files';

export function readLocal(fpath: string): string {
  return fs.readFileSync(path.posix.join(BASE_PATH, fpath)).toString();
}

export function scanDirectory(
  dir: string,
  options: { recursive?: boolean } = {},
  base: string = ''
): FileEntry[] {
  const { recursive = false } = options;
  const fullDirPath = path.join(BASE_PATH, dir, base);
  
  if (!fs.existsSync(fullDirPath)) {
    return [];
  }

  const files = fs.readdirSync(fullDirPath);
  const results: FileEntry[] = [];

  // Add current directory entry (except root which is handled separately)
  if (base || !dir) {
    results.push({
      path: base.endsWith('/') ? base : `${base}/`,
      type: 'directory'
    });
  }

  for (const file of files) {
    const relativePath = path.posix.join(base, file);
    const fullPath = path.join(BASE_PATH, dir, relativePath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (recursive) {
        results.push(...scanDirectory(dir, options, relativePath));
      } else {
        results.push({
          path: `${relativePath}/`,
          type: 'directory'
        });
      }
    } else {
      results.push({
        path: relativePath,
        type: 'file'
      });
    }
  }

  return results;
}

export function getAllFiles(dir: string = ''): Array<{
  params: { path: string };
  props: FileEntry;
}> {
  const files = scanDirectory(dir, { recursive: true });

  return files.map(file => ({
    params: { path: file.path },
    props: { ...file }
  }));
}