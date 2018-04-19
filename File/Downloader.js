define("File/Downloader", ["require", "exports"], function (require, exports) {
    "use strict";
    function Downloader(entity, options, driverName) {
        if (!entity) {
            throw new Error("Некорректный аргумент entity: " + typeof entity);
        }
        require([driverName || DetectDriverName(entity)], function (Driver) {
            new Driver(entity).download(options);
        });
    }
    function DetectDriverName(entity) {
        if (entity.indexOf('https://') !== -1 || entity.indexOf('?') !== -1 || entity.indexOf('&') !== -1) {
            return DriversNames.URL;
        }
        return DriversNames.Base64;
    }
    var DriversNames;
    (function (DriversNames) {
        DriversNames["URL"] = "File/Driver/URL";
        DriversNames["Base64"] = "File/Driver/Base64";
    })(DriversNames || (DriversNames = {}));
    Downloader['DriversNames'] = DriversNames;
    return Downloader;
});
