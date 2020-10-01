define("Controls-demo/DragNDrop/Notes/EntityNote", ["require", "exports", "tslib", "Controls/dragnDrop"], function (require, exports, tslib_1, dragnDrop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EntityNote = /** @class */ (function (_super) {
        tslib_1.__extends(EntityNote, _super);
        function EntityNote(options) {
            var _this = _super.call(this, options) || this;
            _this._startPosition = options.item.get('position');
            return _this;
        }
        EntityNote.prototype.getStartPosition = function () {
            return this._startPosition;
        };
        return EntityNote;
    }(dragnDrop_1.ItemEntity));
    exports.default = EntityNote;
});
