"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    static debug(msg) {
    }
    static trace(msg) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    }
    static info(msg) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    }
    static warn(msg) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    }
    static error(msg) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    }
    static test(msg) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map