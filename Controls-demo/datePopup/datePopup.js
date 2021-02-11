define("Controls-demo/datePopup/datePopup", ["require", "exports", "tslib", "UI/Base", "wml!Controls-demo/datePopup/datePopup"], function (require, exports, tslib_1, Base_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = /** @class */ (function (_super) {
        tslib_1.__extends(default_1, _super);
        function default_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = template;
            return _this;
        }
        default_1._styles = ['Controls-demo/Controls-demo'];
        return default_1;
    }(Base_1.Control));
    exports.default = default_1;
});
