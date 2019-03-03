"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    constructor(ms) {
        this.isCancelled = false;
        this.duration = ms;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((fulfill, reject) => setTimeout(this.isCancelled ? reject : fulfill, this.duration));
        });
    }
    cancel() {
        this.isCancelled = true;
    }
}
exports.default = Timer;
//# sourceMappingURL=timer.js.map