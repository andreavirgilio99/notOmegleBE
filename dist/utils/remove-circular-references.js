"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCircularReferences = void 0;
/**
 * Given an object it returns a copy of it without circular references, this allows it to be serialized and transmitted.
 * @param obj The object you want to sanitize
 * @param visited Ignore this.
 * @returns The sanitized object.
 */
function removeCircularReferences(obj, visited = new Set()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // Controllo se l'oggetto è già stato visitato
    if (visited.has(obj)) {
        return undefined; // Sostituiamo con undefined se l'oggetto è già stato visitato
    }
    // Aggiungiamo l'oggetto corrente all'insieme dei visitati
    visited.add(obj);
    // Se l'oggetto è un array, lo attraversiamo ricorsivamente
    if (Array.isArray(obj)) {
        return obj.map((item) => removeCircularReferences(item, visited));
    }
    // Se l'oggetto è un oggetto, lo attraversiamo ricorsivamente
    const sanitizedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const sanitizedValue = removeCircularReferences(obj[key], visited);
            if (sanitizedValue !== undefined) {
                sanitizedObj[key] = sanitizedValue;
            }
        }
    }
    return sanitizedObj;
}
exports.removeCircularReferences = removeCircularReferences;
