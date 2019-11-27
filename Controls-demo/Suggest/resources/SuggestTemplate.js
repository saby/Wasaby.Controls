define("Controls-demo/Suggest/resources/SuggestTemplate", ["require", "exports", "tslib", "UI/Base", "wml!Controls-demo/Suggest/resources/SuggestTemplate"], function (require, exports, tslib_1, Base_1, controlTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SuggestTemplate = /** @class */ (function (_super) {
        tslib_1.__extends(SuggestTemplate, _super);
        function SuggestTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            return _this;
        }
        return SuggestTemplate;
    }(Base_1.Control));
    exports.default = SuggestTemplate;
});
