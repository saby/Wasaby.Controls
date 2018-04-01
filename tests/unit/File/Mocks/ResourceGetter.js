function definition (Deferred) {
    // IResourceGetterBase mock object construnctor
    function GetterMock(data) {
        data = data || {};
        this.chosenFiles = data.chosenFiles || [];
        this.type = data.type || 'GetterMock';
        this.isDestroy = false
    }
    GetterMock.prototype.canExec = function () {
        return Deferred.success(!this.isDestroy);
    };
    GetterMock.prototype.getFiles = function () {
        var files = this.chosenFiles;
        return Deferred.success(files);
    };
    GetterMock.prototype.getType = function () {
        return this.type;
    };
    GetterMock.prototype.destroy = function () {
        this.isDestroy = true;
    };

    return GetterMock;
}
define('tests/unit/File/Mocks/ResourceGetter', ['Core/Deferred'], definition);
define('optional!tests/unit/File/Mocks/ResourceGetter', ['Core/Deferred'], definition);