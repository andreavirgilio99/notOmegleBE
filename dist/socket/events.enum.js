"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var Events;
(function (Events) {
    Events["Connection"] = "connection";
    Events["Disconnect"] = "disconnect";
    Events["Welcome"] = "welcome";
    Events["DataRegistration"] = "data-registration";
    Events["SearchStart"] = "search-start";
    Events["SearchStop"] = "search-stop";
    Events["SuccessfulPairing"] = "successful-pairing";
    Events["PartnerDisconnected"] = "partner-disconnected";
    Events["SendMessage"] = "send-message";
    Events["MessageReceived"] = "message-received";
    Events["LeaveCall"] = "leave-call";
})(Events = exports.Events || (exports.Events = {}));
