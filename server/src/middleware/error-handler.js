"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorHandler = function (error, _req, res, _next) {
    var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(error);
    res.status(statusCode).json({
        status: statusCode,
        message: error.message,
        stack: process.env.nodeEnv === 'production' ? null : error.stack,
    });
};
exports.errorHandler = errorHandler;
