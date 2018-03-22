function definition(Deferred, GetResources) {
   // IResourceGetterBase mock object construnctor
   var GetterMock = function (data) {
      this.chosenFiles = (!data || !data.chosenFiles) ? [] : data.chosenFiles;
      this.type = (!data || !data.type) ? 'GetterMock' : data.type;
   }
   GetterMock.prototype.canExec = function () {
      return new Deferred().callback(true);
   };
   GetterMock.prototype.getFiles = function () {
      var files = this.chosenFiles;
      return new Deferred().callback(files);
   };
   GetterMock.prototype.getType = function () {
      return this.type;
   };
   return GetterMock;
}

define('Tests/Unit/File/GetterMock', [
   'Core/Deferred',
   'Tests/Unit/File/GetResources'
], definition);

define('optional!Tests/Unit/File/GetterMock', [
   'Core/Deferred',
   'Tests/Unit/File/GetResources'
], definition);