import path from 'path';

export function permalink(...url: string[]): string {
    return path.posix.join(import.meta.env.BASE_URL, ...url);
}