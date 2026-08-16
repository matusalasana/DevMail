"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var error_handler_1 = require("./middleware/error-handler");
var email_routes_1 = require("./modules/emails/email.routes");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/emails", email_routes_1.default);
app.get("/health", function (_req, res) {
    res.json({
        status: "ok",
        service: "devmail-api",
    });
});
app.use(error_handler_1.errorHandler);
exports.default = app;
