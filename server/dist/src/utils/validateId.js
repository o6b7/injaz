"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = void 0;
const validateId = (id, name) => {
    if (id === undefined || id === null) {
        return { valid: false, message: `${name} is required` };
    }
    const numericId = Number(id);
    if (isNaN(numericId) || !Number.isInteger(numericId)) {
        return { valid: false, message: `${name} must be an integer` };
    }
    return { valid: true, value: numericId };
};
exports.validateId = validateId;
