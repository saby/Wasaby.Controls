define("Controls-demo/Suggest/resources/SuggestTabTemplate", ["require", "exports", "tslib", "UI/Base", "wml!Controls-demo/Suggest/resources/SuggestTabTemplate"], function (require, exports, tslib_1, Base_1, controlTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SuggestTabTemplate = /** @class */ (function (_super) {
        tslib_1.__extends(SuggestTabTemplate, _super);
        function SuggestTabTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            return _this;
        }
        return SuggestTabTemplate;
    }(Base_1.Control));
    exports.default = SuggestTabTemplate;
});
