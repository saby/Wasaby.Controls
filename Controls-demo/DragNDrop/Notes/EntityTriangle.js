define("Controls-demo/DragNDrop/Notes/EntityTriangle", ["require", "exports", "tslib", "Controls/dragnDrop"], function (require, exports, tslib_1, dragnDrop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EntityTriangle = /** @class */ (function (_super) {
        tslib_1.__extends(EntityTriangle, _super);
        function EntityTriangle(options) {
            var _this = _super.call(this, options) || this;
            _this._startSize = options.item.get('size');
            return _this;
        }
        EntityTriangle.prototype.getStartSize = function () {
            return this._startSize;
        };
        return EntityTriangle;
    }(dragnDrop_1.ItemEntity));
    exports.default = EntityTriangle;
});
