/// <amd-module name="Controls/File/Attach/Option/Getters/PhotoCam" />
define("Controls/File/Attach/Option/Getters/PhotoCam", ["require", "exports", "tslib", "Controls/File/Attach/Option/ResourceGetter"], function (require, exports, tslib_1, ResourceGetter) {
    "use strict";
    var GETTER_LINK = "Controls/File/ResourceGetter/PhotoCam";
    var GETTER_TYPE = "PhotoCam";
    /**
     * Класс конфигурации IResourceGetter для получения снимков с камеры, передаваемый в Attach
     * @class
     * @name Controls/File/Attach/Option/Getters/PhotoCam
     * @extends Controls/File/Attach/Option/ResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var PhotoCam = /** @class */ (function (_super) {
        tslib_1.__extends(PhotoCam, _super);
        /**
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see Controls/File/IResourceGetter
         */
        function PhotoCam(options) {
            return _super.call(this, GETTER_LINK, GETTER_TYPE, options || {}) || this;
        }
        return PhotoCam;
    }(ResourceGetter));
    return PhotoCam;
});
