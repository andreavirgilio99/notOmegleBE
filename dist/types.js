"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.AgeGroup = exports.SearchStatus = void 0;
var SearchStatus;
(function (SearchStatus) {
    SearchStatus["Ongoing"] = "ongoing";
    SearchStatus["Stopped"] = "stopped";
})(SearchStatus = exports.SearchStatus || (exports.SearchStatus = {}));
var AgeGroup;
(function (AgeGroup) {
    AgeGroup["Adults"] = "adults";
    AgeGroup["Minors"] = "minors";
})(AgeGroup = exports.AgeGroup || (exports.AgeGroup = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Idle"] = "idle";
    UserStatus["Paired"] = "paired";
    UserStatus["Pending"] = "pending";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
