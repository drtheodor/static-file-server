import fs from 'fs';
import proc from 'child_process'
import path from 'path';

import { type FileEntry } from "./files";

const BASE_PATH = './files';

export function readLocal(fpath: string): string {
  return fs.readFileSync(path.posix.join(BASE_PATH, fpath)).toString();
}

export function lastEditedLocal(fpath: string): number {
  fpath = path.posix.join(BASE_PATH, fpath);

  if (process.env.CI) {
    const lastCommitDate = proc.execSync(
      `git log -1 --format=%ct -- "${fpath}"`,
      { encoding: 'utf-8' }
    ).trim();
    
    // Convert timestamp to Date object
    return parseInt(lastCommitDate) * 1000;
  }

  return fs.statSync(fpath).mtimeMs
}

export function lastEditedUTC(fpath: string): number {
  const localDate = new Date(lastEditedLocal(fpath));
  return localDate.getTime();
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
    if (file.startsWith('.')) continue;
    
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

export const ALL_FILES = scanDirectory('', { recursive: true });

export function getAllFiles(dir: string = ''): Array<{
  params: { path: string };
  props: FileEntry;
}> {
  return ALL_FILES.map(file => ({
    params: { path: file.path },
    props: { ...file }
  }));
}

let indexGenerated = false;

export function writeIndex() {
  if (indexGenerated) return;
  fs.writeFileSync('public/files.json', JSON.stringify(ALL_FILES));
  indexGenerated = true;
}

writeIndex()
