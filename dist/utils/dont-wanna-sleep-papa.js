"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDontWannaSleepPapa = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * some hosting services put my babies to sleep when there's inactivity, I don't like that, so here's some fake activity for y'all
 */
function IDontWannaSleepPapa() {
    setInterval(() => {
        axios_1.default.get('https://totally-not-omegle.onrender.com/');
    }, 1000 * 180);
}
exports.IDontWannaSleepPapa = IDontWannaSleepPapa;
