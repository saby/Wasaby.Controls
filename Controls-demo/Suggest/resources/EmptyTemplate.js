define("Controls-demo/Suggest/resources/EmptyTemplate", ["require", "exports", "tslib", "UI/Base", "wml!Controls-demo/Suggest/resources/EmptyTemplate"], function (require, exports, tslib_1, Base_1, controlTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmptyTemplate = /** @class */ (function (_super) {
        tslib_1.__extends(EmptyTemplate, _super);
        function EmptyTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            return _this;
        }
        return EmptyTemplate;
    }(Base_1.Control));
    exports.default = EmptyTemplate;
});
