define("Controls-demo/Async/AsyncDemo", ["require", "exports", "tslib", "Core/Control", "wml!Controls-demo/Async/AsyncDemo"], function (require, exports, tslib_1, Control, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = /** @class */ (function (_super) {
        tslib_1.__extends(default_1, _super);
        function default_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = template;
            _this.showAsync = true;
            _this.buttonCaption = 'Скрыть';
            return _this;
        }
        default_1.prototype.toggleAsync = function () {
            this.showAsync = !this.showAsync;
            this.buttonCaption = this.showAsync ? 'Скрыть' : 'Показать';
        };
        default_1._styles = ['Controls-demo/Async/AsyncDemo'];
        return default_1;
    }(Control));
    exports.default = default_1;
});
