/// <amd-module name="File/Attach/Option/Getters/PhotoCam" />
define("File/Attach/Option/Getters/PhotoCam", ["require", "exports", "tslib", "File/Attach/Option/ResourceGetter"], function (require, exports, tslib_1, ResourceGetter) {
    "use strict";
    var GETTER_LINK = "File/ResourceGetter/PhotoCam";
    var GETTER_TYPE = "PhotoCam";
    /**
     * Класс конфигурации IResourceGetter для получения снимков с камеры, передаваемый в Attach
     * @class
     * @name File/Attach/Option/Getters/PhotoCam
     * @extends File/Attach/Option/ResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var PhotoCam = /** @class */ (function (_super) {
        tslib_1.__extends(PhotoCam, _super);
        /**
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function PhotoCam(options) {
            return _super.call(this, GETTER_LINK, GETTER_TYPE, options || {}) || this;
        }
        /**
         * @description
         * Тип геттера передается в метод choose File/Attach, чтобы указать каким способом(геттером) выбираются файлы
         * <pre>
         *   attach.choose(PhotoCam.getType()); // Получение фото с веб-камеры
         * </pre>
         * @static
         * @method
         * @returns {String} Тип Getter'a
         */
        PhotoCam.getType = function () {
            return GETTER_TYPE;
        };
        return PhotoCam;
    }(ResourceGetter));
    return PhotoCam;
});
