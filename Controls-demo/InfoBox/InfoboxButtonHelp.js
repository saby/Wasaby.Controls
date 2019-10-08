define('Controls-demo/InfoBox/InfoboxButtonHelp', [
    'require',
    'exports',
    'tslib',
    'UI/Base',
    'wml!Controls-demo/InfoBox/InfoboxButtonHelp',
    'css!Controls-demo/InfoBox/resources/InfoboxButtonHelp'
], function (require, exports, tslib_1, Base_1, controlTemplate) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    var InfoboxButtonHelp = /** @class */
    function (_super) {
        tslib_1.__extends(InfoboxButtonHelp, _super);
        function InfoboxButtonHelp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            return _this;
        }
        return InfoboxButtonHelp;
    }(Base_1.Control);
    exports.default = InfoboxButtonHelp;
});