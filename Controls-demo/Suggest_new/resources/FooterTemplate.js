define("Controls-demo/Suggest/resources/FooterTemplate", ["require", "exports", "tslib", "UI/Base", "wml!Controls-demo/Suggest/resources/FooterTemplate"], function (require, exports, tslib_1, Base_1, controlTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FooterTemplate = /** @class */ (function (_super) {
        tslib_1.__extends(FooterTemplate, _super);
        function FooterTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            return _this;
        }
        return FooterTemplate;
    }(Base_1.Control));
    exports.default = FooterTemplate;
});
