/**
 * Performs fuzzy search on a list of file paths.
 * @param query - The search query string
 * @param paths - Array of file paths to search through
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of matching paths sorted by relevance
 */
export function fuzzySearchPaths(query: string, paths: string[], limit: number = 10): string[] {
    if (!query) return paths.slice(0, limit);
    
    const queryLower = query.toLowerCase();
    const results: Array<{ path: string; score: number }> = [];

    for (const path of paths) {
        const score = calculateFuzzyScore(queryLower, path.toLowerCase());
        if (score > 0) {
            results.push({ path, score });
        }
    }

    // Sort by score (descending) and return top results
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.path);
}

/**
 * Calculates a fuzzy matching score between a query and a string.
 * Higher scores indicate better matches.
 */
function calculateFuzzyScore(query: string, str: string): number {
    if (!query || !str) return 0;
    
    let score = 0;
    let queryIndex = 0;
    let consecutiveMatch = 0;
    let maxConsecutive = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === query[queryIndex]) {
            // Bonus for consecutive matches
            consecutiveMatch++;
            // Bonus for matching at the beginning of segments (after path separators)
            if (i === 0 || str[i - 1] === '/' || str[i - 1] === '\\') {
                score += 20;
            } 
            // Bonus for camelCase matches
            else if (str[i - 1] >= 'a' && str[i - 1] <= 'z' && str[i] >= 'A' && str[i] <= 'Z') {
                score += 15;
            }
            // Regular consecutive match bonus
            else {
                score += 5 * consecutiveMatch;
            }
            queryIndex++;
        } else {
            // Reset consecutive counter when match breaks
            maxConsecutive = Math.max(maxConsecutive, consecutiveMatch);
            consecutiveMatch = 0;
        }
    }

    // Return 0 if not all query characters were matched
    if (queryIndex !== query.length) return 0;

    // Additional bonuses
    // Bonus for shorter paths (everything else being equal)
    score += Math.max(0, 100 - str.length);
    // Bonus for consecutive matching segments
    score += maxConsecutive * 2;

    return score;
}

// Example usage:
// const paths = [
//     '/src/components/Header.tsx',
//     '/src/utils/helpers.ts',
//     '/src/components/Footer.tsx',
//     '/src/services/api.ts',
//     '/src/components/Navigation.tsx'
// ];
// 
// console.log(fuzzySearchPaths('comp', paths));
// Output: [
//   '/src/components/Header.tsx',
//   '/src/components/Footer.tsx',
//   '/src/components/Navigation.tsx'
// ]