"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommonInterests = void 0;
function findCommonInterests(interests1, interests2) {
    const set1 = new Set(interests1.map((interest) => interest.toLowerCase()));
    const set2 = new Set(interests2.map((interest) => interest.toLowerCase()));
    const commonInterests = [];
    for (const interest of set1) {
        if (set2.has(interest)) {
            commonInterests.push(interest);
        }
    }
    return commonInterests;
}
exports.findCommonInterests = findCommonInterests;
