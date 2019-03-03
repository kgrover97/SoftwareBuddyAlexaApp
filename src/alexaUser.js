"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlexaUser {
    constructor(user) {
        this.toString = () => {
            return this._id.substring(0, 4) + "..." + this._id.slice(-2);
        };
        let userParts = user.split('.');
        this._id = userParts.pop();
        this._domain = userParts.join(".");
        this._raw = user;
    }
    get raw() {
        return this._raw;
    }
}
exports.default = AlexaUser;
//# sourceMappingURL=alexaUser.js.map