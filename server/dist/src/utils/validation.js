"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredString = exports.validateNumberId = void 0;
const validateNumberId = (id, fieldName = 'ID') => {
    if (id === undefined || id === null || id === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return { isValid: false, error: `${fieldName} must be a number` };
    }
    if (numericId <= 0) {
        return { isValid: false, error: `${fieldName} must be a positive number` };
    }
    return { isValid: true, value: numericId };
};
exports.validateNumberId = validateNumberId;
const validateRequiredString = (value, fieldName) => {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, value: value.trim() };
};
exports.validateRequiredString = validateRequiredString;
