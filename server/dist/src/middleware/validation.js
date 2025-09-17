"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumberParam = exports.validateProjectId = void 0;
const validation_1 = require("../utils/validation");
const validateProjectId = (req, res, next) => {
    const { projectId } = req.query;
    const validation = (0, validation_1.validateNumberId)(projectId, 'projectId');
    if (!validation.isValid) {
        res.status(400).json({ success: false, message: validation.error });
        return;
    }
    // Attach validated ID to request for later use
    res.locals.validatedProjectId = validation.value;
    next();
};
exports.validateProjectId = validateProjectId;
// Generic number ID validator middleware
const validateNumberParam = (paramName) => {
    return (req, res, next) => {
        const paramValue = req.params[paramName];
        const validation = (0, validation_1.validateNumberId)(paramValue, paramName);
        if (!validation.isValid) {
            res.status(400).json({ success: false, message: validation.error });
            return;
        }
        res.locals[`validated${paramName.charAt(0).toUpperCase() + paramName.slice(1)}`] = validation.value;
        next();
    };
};
exports.validateNumberParam = validateNumberParam;
