define("Controls-demo/Suggest/resources/SuggestTabTemplate", ["require", "exports", "tslib", "UI/Base", "Types/source", "wml!Controls-demo/Suggest/resources/SuggestTabTemplate"], function (require, exports, tslib_1, Base_1, source_1, controlTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SuggestTabTemplate = /** @class */ (function (_super) {
        tslib_1.__extends(SuggestTabTemplate, _super);
        function SuggestTabTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._template = controlTemplate;
            _this._tabsOptions = null;
            return _this;
        }
        SuggestTabTemplate.prototype._beforeMount = function () {
            this._tabsOptions = {
                source: new source_1.Memory({
                    keyProperty: 'id',
                    data: [
                        { id: 1, title: 'Контрагенты', text: 'test', align: 'left' },
                        { id: 2, title: 'Компании', text: 'test', align: 'left' }
                    ]
                }),
                keyProperty: 'id',
                displayProperty: 'title'
            };
        };
        return SuggestTabTemplate;
    }(Base_1.Control));
    exports.default = SuggestTabTemplate;
});
