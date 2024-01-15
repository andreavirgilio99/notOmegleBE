"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersCollection = exports.appConfig = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
function appConfig(app) {
    app.use(express_1.default.static(path_1.default.join(__dirname, 'resources')));
    app.get('/assets/*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'resources', req.originalUrl));
    });
    app.get('/polyfills.js', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'resources', 'polyfills.js'));
    });
    app.get('/runtime.js', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'resources', 'runtime.js'));
    });
    app.get('/main.js', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'resources', 'main.js'));
    });
    app.get('*.js', function (req, res, next) {
        res.type('text/javascript');
        next();
    });
    app.get('*.css', function (req, res, next) {
        res.type('text/css');
        next();
    });
}
exports.appConfig = appConfig;
function getUsersCollection() {
    const collection = new Map([
        [types_1.AgeGroup.Adults, new Map([
                [types_1.UserStatus.Idle, new Map()],
                [types_1.UserStatus.Paired, new Map()],
                [types_1.UserStatus.Pending, new Map()],
            ])],
        [types_1.AgeGroup.Minors, new Map([
                [types_1.UserStatus.Idle, new Map()],
                [types_1.UserStatus.Paired, new Map()],
                [types_1.UserStatus.Pending, new Map()],
            ])],
    ]);
    const addUser = (id, data) => {
        var _a;
        const ageGroup = data.isMinor ? types_1.AgeGroup.Minors : types_1.AgeGroup.Adults;
        const status = types_1.UserStatus.Idle;
        const collectionChunk = (_a = collection.get(ageGroup)) === null || _a === void 0 ? void 0 : _a.get(status);
        if (collectionChunk) {
            collectionChunk.set(id, data);
        }
    };
    const removeUser = (id) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    userMap.delete(id);
                    return;
                }
            }
        }
    };
    const switchUserStatus = (id, newStatus) => {
        var _a;
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    const userData = userMap.get(id);
                    userMap.delete(id);
                    const newStatusMap = (_a = collection.get(ageGroup)) === null || _a === void 0 ? void 0 : _a.get(newStatus);
                    if (newStatusMap && userData) {
                        newStatusMap.set(id, userData);
                    }
                    return;
                }
            }
        }
    };
    return [addUser, removeUser, switchUserStatus];
}
exports.getUsersCollection = getUsersCollection;
