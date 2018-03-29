/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
function definition(Deferred) {
// IResourceSourceBase mock object construnctor
    var SourceMock = function (type) {
       this.type = type;
    };

    SourceMock.prototype.create = function (params, file) {
       /**
        * Экземпляр SourceMock при загрузке на него файла возвращает объект со следующими свойствами:
        * @param suitable {Boolean} true, если загруженный файл является экземпляром IFileDataContructor, с которым инициализировался экземпляр SourceMock
        * (для тестирования registerLazySource/registerSource)
        * @param file {IFileDataConstructor} загруженный файл
        * (для тестирования upload)
        * @param params {Object} Полученные параметры при загрузке файла
        * (для тестирования upload)
        */
       return Deferred.success({
          'suitable': this.type ? (file instanceof this.type) : false,
          'params': params,
          'file': file
       });
    };

    SourceMock.prototype.subscribe = function () {};

    return SourceMock;
}

define('tests/unit/File/SourceMock', ['Core/Deferred'], definition);
define('optional!tests/unit/File/SourceMock', ['Core/Deferred'], definition);