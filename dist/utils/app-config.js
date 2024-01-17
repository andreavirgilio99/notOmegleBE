"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
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
