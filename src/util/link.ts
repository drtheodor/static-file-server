import path from 'path';

export function join(...url: string[]): string {
    return path.posix.join(...url);
}

export function permalink(...url: string[]): string {
    return path.posix.join(import.meta.env.BASE_URL, ...url);
}

export function browse(...url: string[]): string {
    return permalink('browse', ...url);
}

export function staticPermalink(...url: string[]): string {
    return `${import.meta.env.BASE_URL}/` + url.join('/');
}

export function staticBrowse(...url: string[]): string {
    return staticPermalink('browse', ...url);
}