define("File/Downloader", ["require", "exports"], function (require, exports) {
    "use strict";
    var Downloader = /** @class */ (function () {
        function Downloader(fileDriver) {
            this.fileDriver = fileDriver;
        }
        Downloader.prototype.save = function (entity, name, options) {
            if (!entity) {
                throw new Error("Некорректный аргумент entity: " + typeof entity);
            }
            var file = new this.fileDriver(entity);
            file.save(name || entity, options);
        };
        return Downloader;
    }());
    return Downloader;
});
