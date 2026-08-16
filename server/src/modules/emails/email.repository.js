"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRepository = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../../db"); // Point to your database connection instance
var emails_1 = require("../../db/schema/emails");
var getEmails = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.select().from(emails_1.emails)];
            case 1:
                list = _a.sent();
                return [2 /*return*/, list !== null && list !== void 0 ? list : []];
        }
    });
}); };
var getEmail = function (emailId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .select()
                    .from(emails_1.emails)
                    .where((0, drizzle_orm_1.eq)(emails_1.emails.id, emailId))];
            case 1:
                result = _b.sent();
                return [2 /*return*/, (_a = result[0]) !== null && _a !== void 0 ? _a : null];
        }
    });
}); };
var create = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var createdEmail;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .insert(emails_1.emails)
                    .values(email)
                    .returning()];
            case 1:
                createdEmail = _b.sent();
                return [2 /*return*/, (_a = createdEmail[0]) !== null && _a !== void 0 ? _a : null];
        }
    });
}); };
var deleteById = function (emailId) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedEmail;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .delete(emails_1.emails)
                    .where((0, drizzle_orm_1.eq)(emails_1.emails.id, emailId))
                    .returning()];
            case 1:
                deletedEmail = _b.sent();
                return [2 /*return*/, (_a = deletedEmail[0]) !== null && _a !== void 0 ? _a : null];
        }
    });
}); };
var deleteAll = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.delete(emails_1.emails)];
            case 1:
                _a.sent();
                return [2 /*return*/, {
                        message: "Inbox cleared",
                    }];
        }
    });
}); };
exports.EmailRepository = {
    getEmail: getEmail,
    getEmail: getEmail,
    create: create,
    deleteById: deleteById,
    deleteAll: deleteAll,
};
