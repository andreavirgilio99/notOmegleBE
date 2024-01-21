export function findCommonInterests(interests1: string[], interests2: string[]): string[] {
    const set1 = new Set(interests1.map((interest) => interest.toLowerCase()));
    const set2 = new Set(interests2.map((interest) => interest.toLowerCase()));

    const commonInterests: string[] = [];

    for (const interest of set1) {
        if (set2.has(interest)) {
            commonInterests.push(interest);
        }
    }

    return commonInterests;
}