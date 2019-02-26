define("Controls/_dataSource/_error/Mode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-module name="Controls/_dataSource/_error/Mode" />
    /**
     * Enum for display error-template mode
     * @enum {string}
     * @name Controls/_dataSource/_error/Mode
     * @readonly
     * @property dialog
     * @property page
     * @property include
     */
    var Mode;
    (function (Mode) {
        Mode["dialog"] = "dialog";
        Mode["page"] = "page";
        Mode["include"] = "include";
    })(Mode || (Mode = {}));
    exports.default = Mode;
});
